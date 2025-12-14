"""
Flashcards Router
Handles endpoints for flashcards and student progress tracking.
Uses shared dependencies for database access.
"""

import logging
from typing import Optional
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

# Use shared dependencies
from backend.utils.dependencies import get_db
from backend.utils.auth import get_current_student_optional, get_student_id_from_token_or_param

from backend.models.flashcard import Flashcard
from backend.models.subject import Subject
from backend.models.chapter import Chapter
from backend.models.students import Student

from backend.services.flashcard_service import save_flashcards_from_quiz, get_flashcards
from backend.services.progress_service import update_progress, get_due_flashcards

from backend.schemas import QuizRequest, ProgressRequest, FlashcardFetchRequest

# Lazy import to avoid circular import issues
def get_ai_tutor():
    from backend.src.tutor.interface import tutor_interface
    return tutor_interface

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/flashcards", tags=["Flashcards"])


# ----------------------------------------------------------
# 1. Save flashcards from quiz
# ----------------------------------------------------------
@router.post("/save_flashcards_from_quiz")
def api_save_flashcards_from_quiz(
    req: QuizRequest,
    student_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Automatically save generated quiz questions as flashcards.
    Each flashcard will be linked to the given student.

    If student_id is not provided, it will be auto-detected from the database.
    """
    try:
        # Get AI Tutor instance
        AI_TUTOR = get_ai_tutor()

        # Use provided student_id or from request, or auto-detect
        effective_student_id = student_id or req.student_id

        if not effective_student_id:
            # Auto-detect first student (for backward compatibility)
            student = db.query(Student).first()
            if student:
                effective_student_id = student.id
            else:
                raise HTTPException(
                    status_code=400,
                    detail="No student_id provided and no students in database"
                )

        # Generate quiz using AI Tutor
        result = AI_TUTOR.generate_all_quizzes(
            subject=req.subject,
            grade_band=req.grade_band,
            chapter_id=req.subchapter_id or req.chapter_id,
            chapter_title=req.subchapter_title or req.chapter_title,
            chapter_summary=req.subchapter_summary or req.chapter_summary,
        )

        # Save "basic" flashcards
        basic_quiz = result.get("basic", [])[0]
        response = save_flashcards_from_quiz(
            quiz_data=basic_quiz,
            subject_name=req.subject,
            chapter_title=req.subchapter_title or req.chapter_title,
            chapter_summary=req.subchapter_summary or req.chapter_summary,
            db=db,
            student_id=effective_student_id,
            chapter_id=req.chapter_id,
            subchapter_id=req.subchapter_id,
        )

        return {
            "message": response["message"],
            "saved_flashcards": len(basic_quiz.get("questions", [])),
            "student_id": effective_student_id,
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Flashcard save failed: {e}")
        raise HTTPException(status_code=500, detail=f"Flashcard save failed: {str(e)}")


# ----------------------------------------------------------
# 2. Get flashcards by subject and chapter
# ----------------------------------------------------------
@router.get("/get_flashcards")
def api_get_flashcards(
    subject: str,
    chapter: str,
    student_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Retrieve flashcards for a given subject and chapter.
    If student_id is provided, return only that student's flashcards.
    """
    cards = get_flashcards(subject, chapter, db, student_id=student_id)
    return {"count": len(cards), "flashcards": cards}


# ----------------------------------------------------------
# 3. Get all flashcards for a student
# ----------------------------------------------------------
@router.get("/get_flashcards_by_student")
def api_get_flashcards_by_student(
    student_id: str,
    db: Session = Depends(get_db)
):
    """
    Retrieve all flashcards associated with a specific student.
    Includes subject and chapter info for frontend display.
    """
    flashcards = (
        db.query(Flashcard, Subject.name.label("subject_name"), Chapter.title.label("chapter_title"))
        .join(Subject, Flashcard.subject_id == Subject.id)
        .join(Chapter, Flashcard.chapter_id == Chapter.id)
        .filter(Flashcard.student_id == student_id)
        .order_by(Flashcard.created_at.desc())
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
# 4. Update progress after answering a flashcard
# ----------------------------------------------------------
@router.post("/update_progress")
def api_update_progress(
    req: ProgressRequest,
    db: Session = Depends(get_db)
):
    """
    Update spaced repetition progress after reviewing a flashcard.
    """
    try:
        result = update_progress(req.student_id, req.flashcard_id, req.correct, db)
        return result
    except Exception as e:
        logger.error(f"Progress update failed: {e}")
        raise HTTPException(status_code=500, detail=f"Progress update failed: {str(e)}")


# ----------------------------------------------------------
# 5. Get due flashcards for spaced repetition
# ----------------------------------------------------------
@router.get("/due_flashcards")
def api_get_due_flashcards(
    student_id: str,
    db: Session = Depends(get_db)
):
    """
    Get all flashcards that are due for review based on spaced repetition schedule.
    """
    cards = get_due_flashcards(student_id, db)
    return {"count": len(cards), "due_flashcards": cards}


# ----------------------------------------------------------
# 6. Get flashcards by chapter for a student
# ----------------------------------------------------------
@router.get("/chapter/{student_id}/{chapter_id}")
def get_flashcards_by_chapter(
    student_id: str,
    chapter_id: str,
    db: Session = Depends(get_db)
):
    """
    Get all flashcards for a specific student and chapter.
    """
    flashcards = (
        db.query(Flashcard)
        .filter(
            Flashcard.student_id == student_id,
            Flashcard.chapter_id == chapter_id
        )
        .order_by(Flashcard.created_at.desc())
        .all()
    )

    chapter = db.query(Chapter).filter(Chapter.id == chapter_id).first()
    chapter_title = chapter.title if chapter else ""

    return {
        "chapter_title": chapter_title,
        "count": len(flashcards),
        "flashcards": [
            {
                "id": f.id,
                "question": f.question_text,
                "answer": f.correct_option,
                "explanation": f.explanation,
                "difficulty": f.difficulty,
                "created_at": str(f.created_at) if f.created_at else None
            }
            for f in flashcards
        ]
    }
