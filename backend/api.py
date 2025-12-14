"""
API backend for the Agentic AI Tutor, replacing the Gradio UI.
This exposes the core functionality via REST endpoints for a React frontend.
"""
import sys, os

# === Fix Python path issues ===
BASE_DIR = os.path.dirname(os.path.abspath(__file__))           # backend/
ROOT_DIR = os.path.dirname(BASE_DIR)                            # project root
SRC_DIR = os.path.join(BASE_DIR, "src")                         # backend/src/

for path in [ROOT_DIR, BASE_DIR, SRC_DIR]:
    if path not in sys.path:
        sys.path.append(path)

from backend.database import SessionLocal, Base, engine
from sqlalchemy import text
from backend.services.flashcard_service import save_flashcards_from_quiz, get_flashcards

# -----------------------------------------------------------
# Flashcard Endpoints
# -----------------------------------------------------------
import backend.models  # noqa: F401  # Ensure all models are registered with Base

from backend.services.progress_service import update_progress, get_due_flashcards
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from pydantic import BaseModel
import random
from datetime import datetime, timedelta
from typing import Optional
import hashlib
import re
import secrets
from src.tutor.interface import tutor_interface as AI_TUTOR
from src.tutor.interface import tutor_interface
from backend.database import SessionLocal
from backend.routes.flashcards_router import router as flashcards_router
import sys, os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from backend.routes.subjects_router import router as subjects_router
from backend.routes.chapters_router import router as chapters_router
from backend.routes.meta_router import router as meta_router
from backend.routes.students_router import router as students_router
from backend.routes.subchapters_router import router as subchapters_router
import logging
import hmac

# === Database Schema Migration ===
def run_migrations():
    """
    Lightweight, idempotent migration helper.
    - For SQLite: keep previous behavior using PRAGMA checks.
    - For MySQL/MariaDB: use information_schema to add missing columns on students.
    """
    try:
        dialect = engine.url.get_backend_name()

        if dialect == "sqlite":
            db_path = engine.url.database
            if db_path and not os.path.isabs(db_path):
                db_path = os.path.abspath(os.path.join(os.getcwd(), db_path))

            conn = engine.raw_connection()
            try:
                cursor = conn.cursor()

                # Ensure students table exists (create all tables if missing)
                cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='students'")
                has_students = cursor.fetchone() is not None
                if not has_students:
                    print(f"Creating database tables (students table missing)... [db={db_path or ':memory:'}]")
                    Base.metadata.create_all(bind=engine)
                    return
                
                # Check if columns exist in students table
                cursor.execute("PRAGMA table_info(students)")
                columns = [info[1] for info in cursor.fetchall()]

                if "name" not in columns:
                    print("Migrating: Adding name column to students table...")
                    cursor.execute("ALTER TABLE students ADD COLUMN name TEXT")
                    if "full_name" in columns:
                        cursor.execute("UPDATE students SET name = full_name WHERE full_name IS NOT NULL")
                
                if "is_active" not in columns:
                    print("Migrating: Adding is_active column to students table...")
                    cursor.execute("ALTER TABLE students ADD COLUMN is_active INTEGER DEFAULT 1")
                    
                if "password" not in columns:
                    print("Migrating: Adding password column to students table...")
                    cursor.execute("ALTER TABLE students ADD COLUMN password TEXT")

                if "board" not in columns:
                    print("Migrating: Adding board column to students table...")
                    cursor.execute("ALTER TABLE students ADD COLUMN board TEXT")

                if "grade_band" not in columns:
                    print("Migrating: Adding grade_band column to students table...")
                    cursor.execute("ALTER TABLE students ADD COLUMN grade_band TEXT")

                if "medium" not in columns:
                    print("Migrating: Adding medium column to students table...")
                    cursor.execute("ALTER TABLE students ADD COLUMN medium TEXT")

                if "phone" not in columns:
                    print("Migrating: Adding phone column to students table...")
                    cursor.execute("ALTER TABLE students ADD COLUMN phone TEXT")

                if "auth_provider" not in columns:
                    print("Migrating: Adding auth_provider column to students table...")
                    cursor.execute("ALTER TABLE students ADD COLUMN auth_provider TEXT")

                if "goal" not in columns:
                    print("Migrating: Adding goal column to students table...")
                    cursor.execute("ALTER TABLE students ADD COLUMN goal TEXT")

                if "preferred_subject_ids" not in columns:
                    print("Migrating: Adding preferred_subject_ids column to students table...")
                    cursor.execute("ALTER TABLE students ADD COLUMN preferred_subject_ids TEXT")

                # Flashcard subchapter support
                cursor.execute("PRAGMA table_info(flashcard)")
                flash_cols = [info[1] for info in cursor.fetchall()]
                if "subchapter_id" not in flash_cols:
                    print("Migrating: Adding subchapter_id to flashcard table...")
                    cursor.execute("ALTER TABLE flashcard ADD COLUMN subchapter_id TEXT")
                    
                conn.commit()
            finally:
                conn.close()

            # Ensure any newly-added tables are created (safe: create missing only).
            Base.metadata.create_all(bind=engine)

            print("Database schema check completed.")
            return

        # MySQL / MariaDB path
        if dialect in ["mysql", "mariadb"]:
            with engine.begin() as conn:
                table_exists = conn.execute(
                    text(
                        "SELECT COUNT(*) FROM information_schema.tables "
                        "WHERE table_schema = DATABASE() AND table_name = 'students'"
                    )
                ).scalar()
                if not table_exists:
                    print("Creating database tables (students table missing)...")
                    Base.metadata.create_all(bind=engine)
                    return

                cols = {
                    row[0]
                    for row in conn.execute(
                        text(
                            "SELECT column_name FROM information_schema.columns "
                            "WHERE table_schema = DATABASE() AND table_name = 'students'"
                        )
                    )
                }

                if "name" not in cols:
                    if "full_name" in cols:
                        print("Migrating: Renaming full_name -> name on students...")
                        conn.execute(text("ALTER TABLE students CHANGE full_name name VARCHAR(100)"))
                    else:
                        print("Migrating: Adding name column to students...")
                        conn.execute(text("ALTER TABLE students ADD COLUMN name VARCHAR(100) NOT NULL"))

                if "password" not in cols:
                    print("Migrating: Adding password column to students...")
                    conn.execute(text("ALTER TABLE students ADD COLUMN password VARCHAR(200)"))

                if "grade_band" not in cols:
                    print("Migrating: Adding grade_band column to students...")
                    conn.execute(text("ALTER TABLE students ADD COLUMN grade_band VARCHAR(20)"))

                if "board" not in cols:
                    print("Migrating: Adding board column to students...")
                    conn.execute(text("ALTER TABLE students ADD COLUMN board VARCHAR(50)"))

                if "is_active" not in cols:
                    print("Migrating: Adding is_active column to students...")
                    conn.execute(text("ALTER TABLE students ADD COLUMN is_active TINYINT(1) DEFAULT 1"))

                if "medium" not in cols:
                    print("Migrating: Adding medium column to students...")
                    conn.execute(text("ALTER TABLE students ADD COLUMN medium VARCHAR(50) NULL"))

                if "phone" not in cols:
                    print("Migrating: Adding phone column to students...")
                    conn.execute(text("ALTER TABLE students ADD COLUMN phone VARCHAR(20) NULL"))

                if "auth_provider" not in cols:
                    print("Migrating: Adding auth_provider column to students...")
                    conn.execute(text("ALTER TABLE students ADD COLUMN auth_provider VARCHAR(20) NULL"))

                if "goal" not in cols:
                    print("Migrating: Adding goal column to students...")
                    conn.execute(text("ALTER TABLE students ADD COLUMN goal VARCHAR(50) NULL"))

                if "preferred_subject_ids" not in cols:
                    print("Migrating: Adding preferred_subject_ids column to students...")
                    conn.execute(text("ALTER TABLE students ADD COLUMN preferred_subject_ids TEXT NULL"))

                # Flashcard subchapter support
                flash_cols = {
                    row[0]
                    for row in conn.execute(
                        text(
                            "SELECT column_name FROM information_schema.columns "
                            "WHERE table_schema = DATABASE() AND table_name = 'flashcard'"
                        )
                    )
                }
                if "subchapter_id" not in flash_cols:
                    print("Migrating: Adding subchapter_id to flashcard table...")
                    conn.execute(text("ALTER TABLE flashcard ADD COLUMN subchapter_id VARCHAR(36) NULL"))

            # Ensure any newly-added tables are created (safe: create missing only).
            Base.metadata.create_all(bind=engine)

            print("Database schema check completed.")
            return

        # Fallback: just ensure tables exist
        print(f"Skipping migrations for unsupported dialect '{dialect}', running create_all() as a fallback...")
        Base.metadata.create_all(bind=engine)

    except Exception as e:
        print(f"Migration warning: {e}")

run_migrations()

logger = logging.getLogger(__name__)

logger = logging.getLogger(__name__)
PARENT_PIN = os.getenv("PARENT_PIN")
if not PARENT_PIN:
    logger.warning("PARENT_PIN not set; parent verification endpoint will be disabled.")

PARENT_PHONE = os.getenv("PARENT_PHONE")
if not PARENT_PHONE:
    logger.warning("PARENT_PHONE not set; parent OTP endpoint will be disabled.")

OTP_SECRET = os.getenv("OTP_SECRET", "dev-insecure-otp-secret")
OTP_TTL_MINUTES = int(os.getenv("OTP_TTL_MINUTES", "10"))
OTP_MAX_ATTEMPTS = int(os.getenv("OTP_MAX_ATTEMPTS", "5"))
OTP_ECHO = os.getenv("OTP_ECHO", "").strip().lower() in {"1", "true", "yes", "y"}
app = FastAPI(title="Euri AI Tutor API", version="2.0")

# Game state management
class GameState:
    def __init__(self):
        self.coins = 100  # Starting coins
        self.total_coins_earned = 100
        self.coin_board = []
        self.streak_days = 0
        self.quizzes_completed = 0
        self.videos_watched = 0
        self.current_level = 1
        self.unlocked_perks = []
        self.daily_progress = {"videos": 0, "quizzes": 0, "study_time": 0}
        self.attention_score = 100
        self.parent_authenticated = False

    def add_coins(self, amount, source="General"):
        if amount <= 0:
            return
        self.coins += amount
        self.total_coins_earned += amount
        self.coin_board.append(
            {
                "timestamp": datetime.utcnow().isoformat(),
                "source": source,
                "amount": amount,
                "total": self.total_coins_earned,
            }
        )

    def spend_coins(self, amount):
        if self.coins >= amount:
            self.coins -= amount
            return True
        return False

# Global game state
game_state = GameState()

# AI Tutor Initialization
try:
    tutor_ready = tutor_interface.retriever is not None
    print(f"🤖 AI Tutor System: {'✅ Ready' if tutor_ready else '❌ Not Ready'}")
except Exception as e:
    print(f"AI Tutor Initialization Error: {e}")
    tutor_ready = False

# Sample video content
SAMPLE_VIDEOS = {
    "Math": [
        {"title": "Fun with Fractions! 🥧", "duration": "15:30", "url": "https://www.youtube.com/embed/dQw4w9WgXcQ"},
        {"title": "Multiplication Magic ✨", "duration": "12:45", "url": "https://www.youtube.com/embed/dQw4w9WgXcQ"},
        {"title": "Geometry Adventures 📐", "duration": "18:20", "url": "https://www.youtube.com/embed/dQw4w9WgXcQ"}
    ],
    "Science": [
        {"title": "Amazing Animals 🦁", "duration": "16:15", "url": "https://www.youtube.com/embed/dQw4w9WgXcQ"},
        {"title": "Space Exploration 🚀", "duration": "14:30", "url": "https://www.youtube.com/embed/dQw4w9WgXcQ"},
        {"title": "Plant Life Cycle 🌱", "duration": "13:45", "url": "https://www.youtube.com/embed/dQw4w9WgXcQ"}
    ],
    "Social Studies": [
        {"title": "Indian History Heroes 🇮🇳", "duration": "17:00", "url": "https://www.youtube.com/embed/dQw4w9WgXcQ"},
        {"title": "Geography Fun 🗺️", "duration": "15:20", "url": "https://www.youtube.com/embed/dQw4w9WgXcQ"},
        {"title": "Culture & Traditions 🎭", "duration": "16:40", "url": "https://www.youtube.com/embed/dQw4w9WgXcQ"}
    ],
    "English": [
        {"title": "Story Time Adventures 📚", "duration": "14:15", "url": "https://www.youtube.com/embed/dQw4w9WgXcQ"},
        {"title": "Grammar Made Easy 📝", "duration": "12:30", "url": "https://www.youtube.com/embed/dQw4w9WgXcQ"},
        {"title": "Poetry Corner 🎵", "duration": "11:45", "url": "https://www.youtube.com/embed/dQw4w9WgXcQ"}
    ]
}

PERKS_SHOP = [
    {"name": "Golden Star Badge ⭐", "cost": 50, "description": "Show everyone you're a star student!"},
    {"name": "Super Learner Avatar 🦸", "cost": 100, "description": "Unlock a cool superhero avatar!"},
    {"name": "Speed Boost ⚡", "cost": 75, "description": "Get extra time for quizzes!"},
    {"name": "Hint Helper 💡", "cost": 30, "description": "Get one free hint per quiz!"},
    {"name": "Rainbow Theme 🌈", "cost": 80, "description": "Make your app colorful!"},
    {"name": "Music Mode 🎵", "cost": 60, "description": "Study with background music!"}
]

# Pydantic models for requests
class ParentPinRequest(BaseModel):
    pin: str

class ParentOtpRequest(BaseModel):
    phone: str

class ParentOtpVerifyRequest(BaseModel):
    phone: str
    otp: str

class VideoRequest(BaseModel):
    subject: str

class QuizRequest(BaseModel):
    subject: str
    grade_band: str
    chapter_id: str
    chapter_title: str
    chapter_summary: str
    subchapter_id: Optional[str] = None
    subchapter_title: Optional[str] = None
    subchapter_summary: Optional[str] = None
    num_questions: int = 5
    difficulty: str = "basic"

class FlashcardFetchRequest(BaseModel):
    subject: str
    chapter: str

from typing import Optional

class QuizScoreRequest(BaseModel):
    answers: list[int]
    correct_answers: list[int]
    difficulty: str = "basic"
    chapter_id: Optional[str] = None
    subject_id: Optional[str] = None
    student_id: Optional[str] = None

class PerkBuyRequest(BaseModel):
    perk_index: int

class RoadmapRequest(BaseModel):
    grade: str
    board: str
    subject: str

class ChatRequest(BaseModel):
    message: str
    subject: str
    grade: str

class ProgressRequest(BaseModel):
    student_id: str
    flashcard_id: str
    correct: bool

# FastAPI app
app.include_router(flashcards_router)
app.include_router(chapters_router)
app.include_router(subjects_router)
app.include_router(meta_router)
app.include_router(students_router)
app.include_router(subchapters_router)
# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:3001", "http://127.0.0.1:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




@app.get("/health")
def health_check():
    return {"status": "ok", "tutor_ready": tutor_ready}

def _normalize_phone(phone: str) -> str:
    raw = (phone or "").strip()
    digits = re.sub(r"\D", "", raw)
    if not digits:
        raise HTTPException(status_code=400, detail="Invalid phone number")
    if len(digits) == 10:
        return f"+91{digits}"
    return f"+{digits}"


def _compute_otp_hash(code: str, identifier: str, purpose: str) -> str:
    msg = f"{purpose}:{identifier}:{code}".encode()
    return hmac.new(OTP_SECRET.encode(), msg, hashlib.sha256).hexdigest()


def _verify_and_consume_parent_otp(db, phone: str, otp: str) -> None:
    from backend.models.otp_code import OtpCode

    otp_row = (
        db.query(OtpCode)
        .filter(
            OtpCode.channel == "phone",
            OtpCode.identifier == phone,
            OtpCode.purpose == "parent",
            OtpCode.consumed_at.is_(None),
            OtpCode.expires_at > datetime.utcnow(),
        )
        .order_by(OtpCode.created_at.desc())
        .first()
    )

    if not otp_row:
        raise HTTPException(status_code=400, detail="OTP expired or not requested. Please request a new OTP.")

    if (otp_row.attempts or 0) >= OTP_MAX_ATTEMPTS:
        raise HTTPException(status_code=429, detail="Too many wrong attempts. Please request a new OTP.")

    expected = _compute_otp_hash((otp or "").strip(), phone, "parent")
    if not hmac.compare_digest(expected, otp_row.otp_hash):
        otp_row.attempts = (otp_row.attempts or 0) + 1
        db.commit()
        raise HTTPException(status_code=400, detail="Invalid OTP. Please try again.")

    otp_row.consumed_at = datetime.utcnow()
    db.commit()


@app.post("/verify_parent")
def api_verify_parent(req: ParentPinRequest):
    if not PARENT_PIN:
        raise HTTPException(status_code=503, detail="Parent verification not configured.")

    if hmac.compare_digest(req.pin, PARENT_PIN):
        game_state.parent_authenticated = True
        return {"success": True, "message": "✅ Parent access granted!"}
    return {"success": False, "message": "❌ Wrong PIN. Try again!"}

@app.post("/parent/request_otp")
def api_parent_request_otp(req: ParentOtpRequest):
    if not PARENT_PHONE:
        raise HTTPException(status_code=503, detail="Parent OTP not configured.")

    phone = _normalize_phone(req.phone)
    allowed = _normalize_phone(PARENT_PHONE)
    if phone != allowed:
        raise HTTPException(status_code=403, detail="This phone number is not authorized for parent access.")

    db = SessionLocal()
    try:
        from backend.models.otp_code import OtpCode

        code = f"{secrets.randbelow(1_000_000):06d}"
        record = OtpCode(
            channel="phone",
            identifier=phone,
            purpose="parent",
            otp_hash=_compute_otp_hash(code, phone, "parent"),
            expires_at=datetime.utcnow() + timedelta(minutes=OTP_TTL_MINUTES),
            attempts=0,
        )
        db.add(record)
        db.commit()

        print(f"[OTP] purpose=parent channel=phone identifier={phone} otp={code}")
        response = {"success": True, "message": "OTP sent"}
        if OTP_ECHO:
            response["dev_otp"] = code
        return response
    finally:
        db.close()


@app.post("/parent/verify_otp")
def api_parent_verify_otp(req: ParentOtpVerifyRequest):
    if not PARENT_PHONE:
        raise HTTPException(status_code=503, detail="Parent OTP not configured.")

    phone = _normalize_phone(req.phone)
    allowed = _normalize_phone(PARENT_PHONE)
    if phone != allowed:
        raise HTTPException(status_code=403, detail="This phone number is not authorized for parent access.")

    db = SessionLocal()
    try:
        _verify_and_consume_parent_otp(db, phone=phone, otp=req.otp)
        game_state.parent_authenticated = True
        return {"success": True, "message": "✅ Parent access granted!"}
    finally:
        db.close()

@app.post("/logout_parent")
def api_logout_parent():
    game_state.parent_authenticated = False
    return {"message": "👋 Parent logged out!"}

@app.get("/get_video_for_subject")
def api_get_video_for_subject(subject: str):
    if subject in SAMPLE_VIDEOS:
        video = random.choice(SAMPLE_VIDEOS[subject])
        return video
    return {"title": "Sample Video 📺", "duration": "15:00", "url": "https://www.youtube.com/embed/dQw4w9WgXcQ"}

@app.get("/simulate_attention_check")
def api_simulate_attention_check():
    attention_level = random.randint(60, 100)
    game_state.attention_score = attention_level

    if attention_level < 80:
        questions = [
            "Hey there! 👋 What was the last thing you learned?",
            "Quick check! 🧠 Can you tell me one interesting fact from the video?",
            "Stay focused! 💪 What do you think happens next?",
            "Attention buddy! 👀 What's your favorite part so far?"
        ]
        return {
            "needs_check": True,
            "socratic_question": random.choice(questions),
            "attention_level": attention_level
        }
    return {
        "needs_check": False,
        "socratic_question": None,
        "attention_level": attention_level
    }

@app.post("/complete_video_watching")
def api_complete_video_watching(req: VideoRequest):
    coins_earned = 20
    game_state.add_coins(coins_earned, source=f"Video: {req.subject}")
    game_state.videos_watched += 1
    game_state.daily_progress["videos"] += 1
    return {"message": f"🎉 Great job! You earned {coins_earned} coins for watching the video! 🎉", "coins_earned": coins_earned, "coins": game_state.coins}


from backend.database import SessionLocal
from backend.services.flashcard_service import save_flashcards_from_quiz

@app.post("/generate_quiz")
def generate_quiz(request: QuizRequest, student_id: str = None):
    """
    Generates quizzes for basic, medium, and hard difficulty levels.
    Automatically saves flashcards (question + explanation) into the database.
    """
    db = SessionLocal()
    try:
        # ✅ Step 1: If student_id provided, validate or override grade_band
        if student_id:
            from backend.models.students import Student
            student = db.query(Student).filter(Student.id == student_id).first()
            if not student:
                raise HTTPException(status_code=404, detail="Student not found")

            # ⚠️ Check for grade mismatch
            if student.grade_band != request.grade_band:
                print(f"⚠️ Grade mismatch for student {student_id}: "
                      f"Request grade='{request.grade_band}', DB grade='{student.grade_band}'. Using DB grade.")
                request.grade_band = student.grade_band  # Correct to student's actual grade

        # ✅ Step 2: Generate quiz using AI_TUTOR
        result = AI_TUTOR.generate_all_quizzes(
            subject=request.subject,
            grade_band=request.grade_band,
            chapter_id=request.subchapter_id or request.chapter_id,
            chapter_title=request.subchapter_title or request.chapter_title,
            chapter_summary=request.subchapter_summary or request.chapter_summary,
        )

        # ✅ Step 3: Auto-save flashcards for each difficulty level
        for difficulty_level, quizzes in result.items():
            for quiz in quizzes:
                save_flashcards_from_quiz(
                    quiz_data=quiz,
                    subject_name=request.subject,
                    chapter_title=request.subchapter_title or request.chapter_title,
                    chapter_summary=request.subchapter_summary or request.chapter_summary,
                    db=db,
                    student_id=student_id,  # store which student generated it
                    chapter_id=request.chapter_id,  # parent chapter
                    subchapter_id=request.subchapter_id,
                )

        # ✅ Step 4: Return quiz data (for frontend)
        return result

    except Exception as e:
        logger.error(f"Quiz generation error: {e}")
        raise HTTPException(status_code=500, detail=f"Error generating quiz: {e}")

    finally:
        db.close()

@app.post("/calculate_quiz_score")
def api_calculate_quiz_score(req: QuizScoreRequest):
    correct = sum(1 for a, c in zip(req.answers, req.correct_answers) if a == c)
    total = len(req.correct_answers)
    percentage = (correct / total) * 100 if total > 0 else 0

    # Save to Scorecard
    db = SessionLocal()
    try:
        from backend.models.scorecard import Scorecard
        new_score = Scorecard(
            student_id=req.student_id, # Can be None
            subject_id=req.subject_id,
            chapter_id=req.chapter_id,
            score=correct,
            total_questions=total,
            difficulty=req.difficulty,
            timestamp=datetime.utcnow()
        )
        db.add(new_score)
        db.commit()
    except Exception as e:
        print(f"Error saving score: {e}")
    finally:
        db.close()

    coins = correct * 10

    if correct == total and total > 0:
        emoji = "🌟"
        message = "Perfect score! You mastered every question!"
    elif correct > 0:
        emoji = "🎯"
        message = f"Great job! You answered {correct} question{'s' if correct != 1 else ''} correctly."
    else:
        emoji = "💪"
        message = "Keep practicing! You'll get better with each try!"

    game_state.add_coins(coins, source="Quiz Correct Answers")
    game_state.quizzes_completed += 1
    game_state.daily_progress["quizzes"] += 1

    return {
        "score": f"{correct}/{total}",
        "percentage": percentage,
        "coins_earned": coins,
        "emoji": emoji,
        "message": message
    }

@app.get("/student_score/{student_id}")
def api_get_student_score(student_id: str):
    db = SessionLocal()
    try:
        from backend.models.scorecard import Scorecard
        from sqlalchemy import func
        
        # Calculate total score (sum of 'score' column)
        total_score = db.query(func.sum(Scorecard.score)).filter(Scorecard.student_id == student_id).scalar() or 0
        
        return {"student_id": student_id, "total_score": total_score}
    except Exception as e:
        logger.error(f"Error fetching student score: {e}")
        raise HTTPException(status_code=500, detail="Error fetching score")
    finally:
        db.close()

@app.get("/coin_display")
def api_get_coin_display():
    return {"display": f"🪙 {game_state.coins} Coins", "coins": game_state.coins}

@app.post("/buy_perk")
def api_buy_perk(req: PerkBuyRequest):
    if 0 <= req.perk_index < len(PERKS_SHOP):
        perk = PERKS_SHOP[req.perk_index]
        if game_state.spend_coins(perk["cost"]):
            game_state.unlocked_perks.append(perk["name"])
            return {"message": f"🎉 You bought {perk['name']}! Enjoy your new perk!", "success": True}
        else:
            return {"message": f"❌ Not enough coins! You need {perk['cost']} coins but only have {game_state.coins}.", "success": False}
    return {"message": "❌ Invalid perk selection.", "success": False}

@app.get("/leaderboard")
def api_get_leaderboard():
    progress = f"""
    🏆 **Your Progress** 🏆
    
    📊 **Stats:**
    - 🪙 Total Coins Earned: {game_state.total_coins_earned}
    - 🎯 Quizzes Completed: {game_state.quizzes_completed}
    - 📺 Videos Watched: {game_state.videos_watched}
    - 🔥 Current Level: {game_state.current_level}
    
    🎁 **Unlocked Perks:** {', '.join(game_state.unlocked_perks) if game_state.unlocked_perks else 'None yet - visit the shop!'}
    
    📈 **Today's Progress:**
    - Videos: {game_state.daily_progress["videos"]} 📺
    - Quizzes: {game_state.daily_progress["quizzes"]} 🎯
    """
    return {"leaderboard": progress}

@app.get("/parent_dashboard")
def api_get_parent_dashboard():
    if not game_state.parent_authenticated:
        raise HTTPException(status_code=403, detail="🔒 Please log in as parent first!")

    dashboard = f"""
    👨‍👩‍👧‍👦 **Parent Dashboard** 👨‍👩‍👧‍👦
    
    📊 **Child's Progress:**
    - 🎯 Quizzes Completed: {game_state.quizzes_completed}
    - 📺 Videos Watched: {game_state.videos_watched}
    - 🪙 Coins Earned: {game_state.total_coins_earned}
    - 👀 Average Attention Score: {game_state.attention_score}%
    
    ⚙️ **Settings:**
    - Webcam Monitoring: {"✅ Enabled" if True else "❌ Disabled"}
    - Study Reminders: {"✅ Enabled" if True else "❌ Disabled"}
    - Screen Time Limit: 2 hours/day
    
    📈 **Weekly Summary:**
    Your child is doing great! They've maintained good focus and are learning consistently.
    
    💡 **Recommendations:**
    - Encourage more Science videos
    - Practice Math quizzes for better scores
    - Celebrate achievements with family time!
    """
    return {"dashboard": dashboard}

@app.post("/generate_roadmap")
def api_generate_roadmap(req: RoadmapRequest):
    if not tutor_ready:
        raise HTTPException(status_code=503, detail="The AI Tutor is not ready. Please check the setup.")
    if not all([req.grade, req.board, req.subject]):
        raise HTTPException(status_code=400, detail="Please select a grade, board, and subject to create a roadmap.")

    roadmap = tutor_interface.generate_learning_roadmap(req.grade, req.board, req.subject)
    return {"roadmap": roadmap}

@app.post("/chat_with_tutor")
def api_chat_with_tutor(req: ChatRequest):
    if not tutor_ready:
        return {"response": "The AI Tutor is currently offline. Please try again later."}

    try:
        bot_response = tutor_interface.chat_with_tutor(req.message, req.subject, req.grade)
        return {"response": bot_response}
    except Exception as e:
        # Fallback response if AI API fails
        fallback_responses = {
            "hello": f"Hello! I'm your AI tutor for {req.subject}. How can I help you learn today? 🤖",
            "hi": f"Hi there! Ready to explore {req.subject}? What would you like to learn? 📚",
            "help": f"I'm here to help you with {req.subject}! You can ask me questions about concepts, problems, or explanations. What specific topic interests you?",
        }

        response = fallback_responses.get(req.message.lower().strip(),
            f"I understand you're asking about '{req.message}' in {req.subject}. While I'm having some connection issues with the advanced AI right now, I can still help! Could you be more specific about what you'd like to learn? 🎓")

        return {"response": response}

# Add more endpoints if needed (e.g., for daily progress reset, etc.)

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting AI Tutor API...")
    uvicorn.run("backend.api:app", host="127.0.0.1", port=8000, reload=False)
