"""
API backend for the Agentic AI Tutor.
This exposes the core functionality via REST endpoints for a React frontend.
"""

import os
import sys
import logging
import random
from datetime import datetime
from typing import Optional

# === Fix Python path issues ===
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(BASE_DIR)
SRC_DIR = os.path.join(BASE_DIR, "src")

for path in [ROOT_DIR, BASE_DIR, SRC_DIR]:
    if path not in sys.path:
        sys.path.append(path)

from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import text
from sqlalchemy.orm import Session

# Database and models
from backend.database import SessionLocal, Base, engine
import backend.models  # noqa: F401 - Ensure all models are registered

# Shared dependencies and utilities
from backend.utils.dependencies import get_db
from backend.utils.security import (
    normalize_phone,
    compute_otp_hash,
    verify_otp_hash,
    generate_otp,
    get_otp_expiry,
    OTP_MAX_ATTEMPTS,
)
from backend.utils.auth import create_parent_token, verify_parent_token

# Models
from backend.models.students import Student
from backend.models.otp_code import OtpCode
from backend.models.scorecard import Scorecard
from backend.models.student_game_state import StudentGameState

# Schemas - Import from centralized location (no duplicates!)
from backend.schemas import (
    ParentPinRequest,
    OtpRequest,
    OtpVerifyRequest,
    QuizRequest,
    QuizScoreRequest,
    PerkBuyRequest,
    RoadmapRequest,
    ChatRequest,
    VideoRequest,
)

# Routers
from backend.routes.flashcards_router import router as flashcards_router
from backend.routes.subjects_router import router as subjects_router
from backend.routes.chapters_router import router as chapters_router
from backend.routes.meta_router import router as meta_router
from backend.routes.students_router import router as students_router
from backend.routes.subchapters_router import router as subchapters_router

# Services
from backend.services.flashcard_service import save_flashcards_from_quiz

logger = logging.getLogger(__name__)

# === Environment Configuration ===
PARENT_PIN = os.getenv("PARENT_PIN")
PARENT_PHONE = os.getenv("PARENT_PHONE")
OTP_ECHO = os.getenv("OTP_ECHO", "").strip().lower() in {"1", "true", "yes", "y"}

if not PARENT_PIN:
    logger.warning("PARENT_PIN not set; parent PIN verification will be disabled.")
if not PARENT_PHONE:
    logger.warning("PARENT_PHONE not set; parent OTP endpoint will be disabled.")


# === Database Schema Migration ===
def run_migrations():
    """
    Lightweight, idempotent migration helper.
    Supports SQLite and MySQL/MariaDB.
    """
    try:
        dialect = engine.url.get_backend_name()

        if dialect == "sqlite":
            conn = engine.raw_connection()
            try:
                cursor = conn.cursor()

                # Check if tables exist
                cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='students'")
                has_students = cursor.fetchone() is not None
                if not has_students:
                    print("Creating database tables...")
                    Base.metadata.create_all(bind=engine)
                    return

                # Students table migrations
                cursor.execute("PRAGMA table_info(students)")
                columns = [info[1] for info in cursor.fetchall()]

                migrations = [
                    ("name", "ALTER TABLE students ADD COLUMN name TEXT"),
                    ("is_active", "ALTER TABLE students ADD COLUMN is_active INTEGER DEFAULT 1"),
                    ("password", "ALTER TABLE students ADD COLUMN password TEXT"),
                    ("board", "ALTER TABLE students ADD COLUMN board TEXT"),
                    ("grade_band", "ALTER TABLE students ADD COLUMN grade_band TEXT"),
                    ("medium", "ALTER TABLE students ADD COLUMN medium TEXT"),
                    ("phone", "ALTER TABLE students ADD COLUMN phone TEXT"),
                    ("auth_provider", "ALTER TABLE students ADD COLUMN auth_provider TEXT"),
                    ("goal", "ALTER TABLE students ADD COLUMN goal TEXT"),
                    ("preferred_subject_ids", "ALTER TABLE students ADD COLUMN preferred_subject_ids TEXT"),
                    ("board_id", "ALTER TABLE students ADD COLUMN board_id TEXT"),
                    ("grade_id", "ALTER TABLE students ADD COLUMN grade_id TEXT"),
                    ("language_id", "ALTER TABLE students ADD COLUMN language_id TEXT"),
                ]

                for col_name, sql in migrations:
                    if col_name not in columns:
                        print(f"Migrating: Adding {col_name} column to students table...")
                        cursor.execute(sql)

                # Handle name migration from full_name
                if "name" not in columns and "full_name" in columns:
                    cursor.execute("UPDATE students SET name = full_name WHERE full_name IS NOT NULL")

                # Flashcard table migrations
                cursor.execute("PRAGMA table_info(flashcard)")
                flash_cols = [info[1] for info in cursor.fetchall()]
                if "subchapter_id" not in flash_cols:
                    print("Migrating: Adding subchapter_id to flashcard table...")
                    cursor.execute("ALTER TABLE flashcard ADD COLUMN subchapter_id TEXT")

                # Quiz table migrations
                cursor.execute("PRAGMA table_info(quiz)")
                quiz_cols = [info[1] for info in cursor.fetchall()]
                if "created_at" not in quiz_cols:
                    print("Migrating: Adding created_at to quiz table...")
                    cursor.execute("ALTER TABLE quiz ADD COLUMN created_at DATETIME")

                # Scorecard table migrations
                cursor.execute("PRAGMA table_info(scorecard)")
                score_cols = [info[1] for info in cursor.fetchall()]
                if "quiz_id" not in score_cols:
                    print("Migrating: Adding quiz_id to scorecard table...")
                    cursor.execute("ALTER TABLE scorecard ADD COLUMN quiz_id TEXT")

                conn.commit()
            finally:
                conn.close()

            # Create any new tables
            Base.metadata.create_all(bind=engine)
            print("Database schema check completed.")
            return

        # MySQL/MariaDB path
        if dialect in ["mysql", "mariadb"]:
            with engine.begin() as conn:
                table_exists = conn.execute(
                    text(
                        "SELECT COUNT(*) FROM information_schema.tables "
                        "WHERE table_schema = DATABASE() AND table_name = 'students'"
                    )
                ).scalar()
                if not table_exists:
                    print("Creating database tables...")
                    Base.metadata.create_all(bind=engine)
                    return

            Base.metadata.create_all(bind=engine)
            print("Database schema check completed.")
            return

        # Fallback
        print(f"Skipping migrations for dialect '{dialect}', running create_all()...")
        Base.metadata.create_all(bind=engine)

    except Exception as e:
        print(f"Migration warning: {e}")


# Run migrations on startup
run_migrations()


# === FastAPI App ===
app = FastAPI(
    title="Euri AI Tutor API",
    version="2.0",
    description="AI-powered educational platform for students"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(flashcards_router)
app.include_router(chapters_router)
app.include_router(subjects_router)
app.include_router(meta_router)
app.include_router(students_router)
app.include_router(subchapters_router)


# === AI Tutor Initialization ===
def get_tutor_interface():
    """Lazy load AI Tutor to avoid import issues."""
    from src.tutor.interface import tutor_interface
    return tutor_interface


try:
    tutor = get_tutor_interface()
    tutor_ready = tutor.retriever is not None
    print(f"AI Tutor System: {'Ready' if tutor_ready else 'Not Ready'}")
except Exception as e:
    print(f"AI Tutor Initialization Error: {e}")
    tutor_ready = False


# === Static Content ===
SAMPLE_VIDEOS = {
    "Math": [
        {"title": "Fun with Fractions!", "duration": "15:30", "url": "https://www.youtube.com/embed/dQw4w9WgXcQ"},
        {"title": "Multiplication Magic", "duration": "12:45", "url": "https://www.youtube.com/embed/dQw4w9WgXcQ"},
    ],
    "Science": [
        {"title": "Amazing Animals", "duration": "16:15", "url": "https://www.youtube.com/embed/dQw4w9WgXcQ"},
        {"title": "Space Exploration", "duration": "14:30", "url": "https://www.youtube.com/embed/dQw4w9WgXcQ"},
    ],
    "Social Studies": [
        {"title": "Indian History Heroes", "duration": "17:00", "url": "https://www.youtube.com/embed/dQw4w9WgXcQ"},
    ],
    "English": [
        {"title": "Story Time Adventures", "duration": "14:15", "url": "https://www.youtube.com/embed/dQw4w9WgXcQ"},
    ]
}

PERKS_SHOP = [
    {"id": "golden_star", "name": "Golden Star Badge", "cost": 50, "description": "Show everyone you're a star student!"},
    {"id": "super_learner", "name": "Super Learner Avatar", "cost": 100, "description": "Unlock a cool superhero avatar!"},
    {"id": "speed_boost", "name": "Speed Boost", "cost": 75, "description": "Get extra time for quizzes!"},
    {"id": "hint_helper", "name": "Hint Helper", "cost": 30, "description": "Get one free hint per quiz!"},
    {"id": "rainbow_theme", "name": "Rainbow Theme", "cost": 80, "description": "Make your app colorful!"},
    {"id": "music_mode", "name": "Music Mode", "cost": 60, "description": "Study with background music!"},
]


# === Helper Functions ===
def get_or_create_game_state(db: Session, student_id: str) -> StudentGameState:
    """Get or create game state for a student."""
    game_state = db.query(StudentGameState).filter(
        StudentGameState.student_id == student_id
    ).first()

    if not game_state:
        game_state = StudentGameState(student_id=student_id)
        db.add(game_state)
        db.commit()
        db.refresh(game_state)

    return game_state


# === Health Check ===
@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {
        "status": "ok",
        "tutor_ready": tutor_ready,
        "timestamp": datetime.utcnow().isoformat()
    }


# === Parent Authentication ===
from pydantic import BaseModel


class ParentOtpRequest(BaseModel):
    phone: str


class ParentOtpVerifyRequest(BaseModel):
    phone: str
    otp: str


@app.post("/verify_parent")
def api_verify_parent(req: ParentPinRequest, db: Session = Depends(get_db)):
    """Verify parent with PIN and return JWT token."""
    if not PARENT_PIN:
        raise HTTPException(status_code=503, detail="Parent verification not configured.")

    import hmac
    if hmac.compare_digest(req.pin, PARENT_PIN):
        # For PIN auth, we need a student_id - get first student or use a placeholder
        student = db.query(Student).first()
        student_id = student.id if student else "parent-session"

        token = create_parent_token(student_id)
        return {
            "success": True,
            "message": "Parent access granted!",
            "access_token": token,
            "token_type": "bearer"
        }

    raise HTTPException(status_code=401, detail="Invalid PIN")


@app.post("/parent/request_otp")
def api_parent_request_otp(req: ParentOtpRequest, db: Session = Depends(get_db)):
    """Request OTP for parent authentication."""
    if not PARENT_PHONE:
        raise HTTPException(status_code=503, detail="Parent OTP not configured.")

    phone = normalize_phone(req.phone)
    allowed = normalize_phone(PARENT_PHONE)

    if phone != allowed:
        raise HTTPException(status_code=403, detail="This phone number is not authorized for parent access.")

    code = generate_otp()
    record = OtpCode(
        channel="phone",
        identifier=phone,
        purpose="parent",
        otp_hash=compute_otp_hash(phone, code, "parent"),
        expires_at=get_otp_expiry(),
        attempts=0,
    )
    db.add(record)
    db.commit()

    print(f"[OTP] purpose=parent channel=phone identifier={phone} otp={code}")

    response = {"success": True, "message": "OTP sent"}
    if OTP_ECHO:
        response["dev_otp"] = code
    return response


@app.post("/parent/verify_otp")
def api_parent_verify_otp(req: ParentOtpVerifyRequest, db: Session = Depends(get_db)):
    """Verify parent OTP and return JWT token."""
    if not PARENT_PHONE:
        raise HTTPException(status_code=503, detail="Parent OTP not configured.")

    phone = normalize_phone(req.phone)
    allowed = normalize_phone(PARENT_PHONE)

    if phone != allowed:
        raise HTTPException(status_code=403, detail="This phone number is not authorized for parent access.")

    # Verify OTP
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
        raise HTTPException(status_code=400, detail="OTP expired or not requested.")

    if (otp_row.attempts or 0) >= OTP_MAX_ATTEMPTS:
        raise HTTPException(status_code=429, detail="Too many wrong attempts.")

    if not verify_otp_hash(phone, req.otp.strip(), "parent", otp_row.otp_hash):
        otp_row.attempts = (otp_row.attempts or 0) + 1
        db.commit()
        raise HTTPException(status_code=400, detail="Invalid OTP.")

    otp_row.consumed_at = datetime.utcnow()
    db.commit()

    # Get student for token
    student = db.query(Student).first()
    student_id = student.id if student else "parent-session"

    token = create_parent_token(student_id)
    return {
        "success": True,
        "message": "Parent access granted!",
        "access_token": token,
        "token_type": "bearer"
    }


@app.post("/logout_parent")
def api_logout_parent():
    """Logout parent (client should discard token)."""
    return {"message": "Parent logged out. Please discard your token."}


# === Video Endpoints ===
@app.get("/get_video_for_subject")
def api_get_video_for_subject(subject: str):
    """Get a random video for the given subject."""
    if subject in SAMPLE_VIDEOS:
        return random.choice(SAMPLE_VIDEOS[subject])
    return {"title": "Sample Video", "duration": "15:00", "url": "https://www.youtube.com/embed/dQw4w9WgXcQ"}


@app.get("/simulate_attention_check")
def api_simulate_attention_check():
    """Simulate attention check (for demo purposes)."""
    attention_level = random.randint(60, 100)

    if attention_level < 80:
        questions = [
            "Hey there! What was the last thing you learned?",
            "Quick check! Can you tell me one interesting fact from the video?",
            "Stay focused! What do you think happens next?",
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
def api_complete_video_watching(
    req: VideoRequest,
    student_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Record video completion and award coins."""
    coins_earned = 20

    if student_id:
        game_state = get_or_create_game_state(db, student_id)
        game_state.add_coins(coins_earned)
        game_state.total_videos_watched += 1
        game_state.increment_daily_stat("videos_watched")
        game_state.update_streak()
        db.commit()

    return {
        "message": f"Great job! You earned {coins_earned} coins for watching the video!",
        "coins_earned": coins_earned
    }


# === Quiz Endpoints ===
@app.post("/generate_quiz")
def generate_quiz(
    request: QuizRequest,
    student_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Generate quizzes for all difficulty levels and save flashcards."""
    try:
        tutor = get_tutor_interface()

        # Validate student if provided
        effective_student_id = student_id or request.student_id
        if effective_student_id:
            student = db.query(Student).filter(Student.id == effective_student_id).first()
            if not student:
                raise HTTPException(status_code=404, detail="Student not found")

            # Use student's grade if different from request
            if student.grade_band and student.grade_band != request.grade_band:
                logger.info(f"Using student's grade {student.grade_band} instead of {request.grade_band}")
                request.grade_band = student.grade_band

        # Generate quiz
        result = tutor.generate_all_quizzes(
            subject=request.subject,
            grade_band=request.grade_band,
            chapter_id=request.subchapter_id or request.chapter_id,
            chapter_title=request.subchapter_title or request.chapter_title,
            chapter_summary=request.subchapter_summary or request.chapter_summary,
        )

        # Save flashcards for each difficulty level
        for difficulty_level, quizzes in result.items():
            for quiz in quizzes:
                try:
                    save_flashcards_from_quiz(
                        quiz_data=quiz,
                        subject_name=request.subject,
                        chapter_title=request.subchapter_title or request.chapter_title,
                        chapter_summary=request.subchapter_summary or request.chapter_summary,
                        db=db,
                        student_id=effective_student_id,
                        chapter_id=request.chapter_id,
                        subchapter_id=request.subchapter_id,
                    )
                except Exception as e:
                    logger.warning(f"Failed to save flashcards: {e}")

        return result

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Quiz generation error: {e}")
        raise HTTPException(status_code=500, detail=f"Error generating quiz: {e}")


@app.post("/calculate_quiz_score")
def api_calculate_quiz_score(
    req: QuizScoreRequest,
    db: Session = Depends(get_db)
):
    """Calculate quiz score, save to database, and award coins."""
    correct = sum(1 for a, c in zip(req.answers, req.correct_answers) if a == c)
    total = len(req.correct_answers)
    percentage = (correct / total) * 100 if total > 0 else 0
    coins = correct * 10

    # Save scorecard
    try:
        if req.student_id and req.subject_id and req.chapter_id:
            new_score = Scorecard(
                student_id=req.student_id,
                subject_id=req.subject_id,
                chapter_id=req.chapter_id,
                quiz_id=req.quiz_id,
                score=correct,
                total_questions=total,
                difficulty=req.difficulty,
            )
            db.add(new_score)

            # Update game state
            if req.student_id:
                game_state = get_or_create_game_state(db, req.student_id)
                game_state.add_coins(coins)
                game_state.total_quizzes_completed += 1
                game_state.increment_daily_stat("quizzes_completed")
                game_state.update_streak()

            db.commit()
    except Exception as e:
        logger.error(f"Error saving score: {e}")
        db.rollback()

    # Generate message
    if correct == total and total > 0:
        message = "Perfect score! You mastered every question!"
    elif correct > 0:
        message = f"Great job! You answered {correct} question{'s' if correct != 1 else ''} correctly."
    else:
        message = "Keep practicing! You'll get better with each try!"

    return {
        "score": correct,
        "total": total,
        "percentage": percentage,
        "coins_earned": coins,
        "message": message
    }


@app.get("/student_score/{student_id}")
def api_get_student_score(student_id: str, db: Session = Depends(get_db)):
    """Get total score for a student."""
    from sqlalchemy import func

    total_score = db.query(func.sum(Scorecard.score)).filter(
        Scorecard.student_id == student_id
    ).scalar() or 0

    return {"student_id": student_id, "total_score": total_score}


# === Gamification Endpoints ===
@app.get("/coin_display")
def api_get_coin_display(student_id: Optional[str] = None, db: Session = Depends(get_db)):
    """Get coin display for a student."""
    if student_id:
        game_state = get_or_create_game_state(db, student_id)
        return {"display": f"{game_state.coins} Coins", "coins": game_state.coins}

    return {"display": "0 Coins", "coins": 0}


@app.get("/game_state/{student_id}")
def api_get_game_state(student_id: str, db: Session = Depends(get_db)):
    """Get full game state for a student."""
    game_state = get_or_create_game_state(db, student_id)

    return {
        "coins": game_state.coins,
        "total_coins_earned": game_state.total_coins_earned,
        "current_streak": game_state.current_streak,
        "longest_streak": game_state.longest_streak,
        "daily_progress": game_state.get_daily_progress(),
        "purchased_perks": game_state.get_purchased_perks(),
        "total_quizzes_completed": game_state.total_quizzes_completed,
        "total_flashcards_reviewed": game_state.total_flashcards_reviewed,
        "total_videos_watched": game_state.total_videos_watched,
    }


@app.post("/buy_perk")
def api_buy_perk(req: PerkBuyRequest, db: Session = Depends(get_db)):
    """Buy a perk with coins."""
    if not req.student_id:
        raise HTTPException(status_code=400, detail="student_id is required")

    if not (0 <= req.perk_index < len(PERKS_SHOP)):
        raise HTTPException(status_code=400, detail="Invalid perk selection")

    perk = PERKS_SHOP[req.perk_index]
    game_state = get_or_create_game_state(db, req.student_id)

    # Check if already owned
    if perk["id"] in game_state.get_purchased_perks():
        return {"message": f"You already own {perk['name']}!", "success": False}

    if game_state.spend_coins(perk["cost"]):
        game_state.add_perk(perk["id"])
        db.commit()
        return {
            "message": f"You bought {perk['name']}! Enjoy your new perk!",
            "success": True,
            "remaining_coins": game_state.coins
        }

    return {
        "message": f"Not enough coins! You need {perk['cost']} coins but only have {game_state.coins}.",
        "success": False
    }


@app.get("/perks_shop")
def api_get_perks_shop():
    """Get available perks."""
    return {"perks": PERKS_SHOP}


@app.get("/leaderboard")
def api_get_leaderboard(student_id: Optional[str] = None, db: Session = Depends(get_db)):
    """Get leaderboard/progress information."""
    if student_id:
        game_state = get_or_create_game_state(db, student_id)
        return {
            "total_coins_earned": game_state.total_coins_earned,
            "quizzes_completed": game_state.total_quizzes_completed,
            "videos_watched": game_state.total_videos_watched,
            "current_streak": game_state.current_streak,
            "longest_streak": game_state.longest_streak,
            "unlocked_perks": game_state.get_purchased_perks(),
            "daily_progress": game_state.get_daily_progress(),
        }

    return {"message": "Provide student_id for personalized progress"}


@app.get("/parent_dashboard")
def api_get_parent_dashboard(
    student_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get parent dashboard with child's progress."""
    if not student_id:
        # Get first student if no ID provided
        student = db.query(Student).first()
        if not student:
            raise HTTPException(status_code=404, detail="No students found")
        student_id = student.id

    game_state = get_or_create_game_state(db, student_id)
    student = db.query(Student).filter(Student.id == student_id).first()

    return {
        "student_name": student.name if student else "Student",
        "quizzes_completed": game_state.total_quizzes_completed,
        "videos_watched": game_state.total_videos_watched,
        "total_coins_earned": game_state.total_coins_earned,
        "current_streak": game_state.current_streak,
        "longest_streak": game_state.longest_streak,
        "total_time_spent_minutes": game_state.total_time_spent_minutes,
        "daily_progress": game_state.get_daily_progress(),
    }


# === AI Tutor Endpoints ===
@app.post("/generate_roadmap")
def api_generate_roadmap(req: RoadmapRequest):
    """Generate a learning roadmap."""
    if not tutor_ready:
        raise HTTPException(status_code=503, detail="AI Tutor is not ready.")

    if not all([req.grade, req.board, req.subject]):
        raise HTTPException(status_code=400, detail="Please select grade, board, and subject.")

    tutor = get_tutor_interface()
    roadmap = tutor.generate_learning_roadmap(req.grade, req.board, req.subject)
    return {"roadmap": roadmap}


@app.post("/chat_with_tutor")
def api_chat_with_tutor(req: ChatRequest):
    """Chat with the AI tutor."""
    if not tutor_ready:
        return {"response": "The AI Tutor is currently offline. Please try again later."}

    try:
        tutor = get_tutor_interface()
        bot_response = tutor.chat_with_tutor(req.message, req.subject, req.grade)
        return {"response": bot_response}
    except Exception as e:
        logger.error(f"Chat error: {e}")
        fallback_responses = {
            "hello": f"Hello! I'm your AI tutor for {req.subject}. How can I help you learn today?",
            "hi": f"Hi there! Ready to explore {req.subject}? What would you like to learn?",
            "help": f"I'm here to help you with {req.subject}! What specific topic interests you?",
        }
        response = fallback_responses.get(
            req.message.lower().strip(),
            f"I understand you're asking about '{req.message}' in {req.subject}. Could you be more specific?"
        )
        return {"response": response}


# === Main Entry Point ===
if __name__ == "__main__":
    import uvicorn
    print("Starting AI Tutor API...")
    uvicorn.run("backend.api:app", host="127.0.0.1", port=8000, reload=False)
