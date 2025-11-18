"""
Flashcards Router
Handles endpoints for flashcards and student progress tracking.
"""

import os, sys
import logging
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from backend.models.flashcard import Flashcard

# --- Dynamically fix import paths ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))        # backend/routes/
BACKEND_DIR = os.path.dirname(BASE_DIR)                      # backend/
ROOT_DIR = os.path.dirname(BACKEND_DIR)                      # project root
SRC_DIR = os.path.join(ROOT_DIR, "src")

for path in [ROOT_DIR, BACKEND_DIR, SRC_DIR]:
    if path not in sys.path:
        sys.path.append(path)

# --- Local Imports ---
from backend.database import SessionLocal
from backend.services.flashcard_service import save_flashcards_from_quiz, get_flashcards
from backend.services.progress_service import update_progress, get_due_flashcards
from src.tutor.interface import tutor_interface as AI_TUTOR
from backend.schemas import QuizRequest  # ✅ Correct import (avoid circular import)

# --- Setup ---
logger = logging.getLogger(__name__)
router = APIRouter(prefix="/flashcards", tags=["Flashcards"])

# --- Dependency ---
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# --- Request Models ---
class ProgressRequest(BaseModel):
    student_id: int
    flashcard_id: int
    correct: bool


class FlashcardFetchRequest(BaseModel):
    subject: str
    chapter: str


# ----------------------------------------------------------
# 1️⃣ Save flashcards from quiz
# ----------------------------------------------------------
@router.post("/save_flashcards_from_quiz")
def api_save_flashcards_from_quiz(req: QuizRequest, student_id: int = 1):
    """
    Automatically save generated quiz questions as flashcards (with explanations).
    Each flashcard will be linked to the given student.
    """
    db = SessionLocal()
    try:
        # Generate quiz using AI Tutor
        result = AI_TUTOR.generate_all_quizzes(
            subject=req.subject,
            grade_band=req.grade_band,
            chapter_id=req.chapter_id,
            chapter_title=req.chapter_title,
            chapter_summary=req.chapter_summary,
        )

        # Save "basic" flashcards
        basic_quiz = result.get("basic", [])[0]
        response = save_flashcards_from_quiz(
            quiz_data=basic_quiz,
            subject_name=req.subject,
            chapter_title=req.chapter_title,
            db=db,
            student_id=student_id,  # ✅ link flashcards to student
        )

        return {
            "message": response["message"],
            "saved_flashcards": len(basic_quiz.get("questions", [])),
        }

    except Exception as e:
        logger.error(f"Flashcard save failed: {e}")
        raise HTTPException(status_code=500, detail=f"Flashcard save failed: {str(e)}")

    finally:
        db.close()


# ----------------------------------------------------------
# 2️⃣ Get flashcards by subject and chapter (global or per student)
# ----------------------------------------------------------
@router.get("/get_flashcards")
def api_get_flashcards(subject: str, chapter: str, student_id: int | None = None):
    """
    Retrieve flashcards for a given subject and chapter.
    If `student_id` is provided, return only that student's flashcards.
    """
    db = SessionLocal()
    try:
        cards = get_flashcards(subject, chapter, db, student_id=student_id)
        return {"count": len(cards), "flashcards": cards}
    finally:
        db.close()


# ----------------------------------------------------------
# 3️⃣ Get flashcards belonging to a student
# ----------------------------------------------------------
@router.get("/get_flashcards_by_student")
def api_get_flashcards_by_student(student_id: int, db: Session = Depends(get_db)):
    """
    Retrieve all flashcards associated with a specific student.
    Includes subject and chapter info for frontend display.
    """
    from backend.models.flashcard import Flashcard
    from backend.models.subject import Subject
    from backend.models.chapter import Chapter

    flashcards = (
        db.query(Flashcard, Subject.name.label("subject_name"), Chapter.title.label("chapter_title"))
        .join(Subject, Flashcard.subject_id == Subject.id)
        .join(Chapter, Flashcard.chapter_id == Chapter.id)
        .filter(Flashcard.student_id == student_id)
        .all()
    )

    if not flashcards:
        return {"count": 0, "flashcards": []}

    result = []
    for f, subject_name, chapter_title in flashcards:
        result.append({
            "id": f.id,
            "question_text": f.question_text,
            "correct_option": f.correct_option,
            "explanation": f.explanation,
            "difficulty": f.difficulty,
            "subject": subject_name,
            "chapter": chapter_title,
            "created_at": str(f.created_at)
        })

    return {"count": len(result), "flashcards": result}

# ----------------------------------------------------------
# 4️⃣ Update progress after answering a flashcard
# ----------------------------------------------------------
@router.post("/update_progress")
def api_update_progress(req: ProgressRequest):
    db = SessionLocal()
    try:
        result = update_progress(req.student_id, req.flashcard_id, req.correct, db)
        return result
    finally:
        db.close()


# ----------------------------------------------------------
# 5️⃣ Get due flashcards for spaced repetition
# ----------------------------------------------------------
@router.get("/due_flashcards")
def api_get_due_flashcards(student_id: int):
    db = SessionLocal()
    try:
        cards = get_due_flashcards(student_id, db)
        return {"count": len(cards), "due_flashcards": cards}
    finally:
        db.close()

@router.get("/chapter/{student_id}/{chapter_id}")
def get_flashcards_by_chapter(student_id: int, chapter_id: int, db: Session = Depends(get_db)):
    flashcards = (
        db.query(Flashcard)
        .filter(
            Flashcard.student_id == student_id,
            Flashcard.chapter_id == chapter_id
        )
        .all()
    )

    return [
        {
            "id": f.id,
            "question": f.question_text,
            "answer": f.correct_option,
            "explanation": f.explanation,
            "difficulty": f.difficulty,
            "created_at": f.created_at
        }
        for f in flashcards
    ]
