"""
Student Progress Service
Tracks how each student interacts with flashcards for adaptive learning.
"""

from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from backend.models.student_progress import StudentProgress
from backend.models.flashcard import Flashcard


def update_progress(student_id: str, flashcard_id: str, correct: bool, db: Session):
    """
    Updates progress for a flashcard after a student reviews it.
    """
    record = db.query(StudentProgress).filter(
        StudentProgress.student_id == student_id,
        StudentProgress.flashcard_id == flashcard_id
    ).first()

    now = datetime.now()

    if not record:
        # First interaction
        record = StudentProgress(
            student_id=student_id,
            flashcard_id=flashcard_id,
            status="reviewing" if correct else "new",
            attempts=1,
            last_reviewed=now,
            next_review=now + timedelta(days=1 if correct else 0.5)
        )
        db.add(record)
    else:
        # Update existing record
        record.attempts += 1
        record.last_reviewed = now
        if correct:
            # Spaced repetition logic
            record.status = "mastered" if record.attempts >= 3 else "reviewing"
            record.next_review = now + timedelta(days=2 * record.attempts)
        else:
            record.status = "reviewing"
            record.next_review = now + timedelta(hours=12)

    db.commit()
    return {
        "message": f"✅ Progress updated for flashcard {flashcard_id}",
        "status": record.status,
        "next_review": str(record.next_review),
    }


def get_due_flashcards(student_id: str, db: Session):
    """
    Returns all flashcards that are due for review today.
    """
    now = datetime.now()
    due_cards = (
        db.query(Flashcard)
        .join(StudentProgress, Flashcard.id == StudentProgress.flashcard_id)
        .filter(
            StudentProgress.student_id == student_id,
            StudentProgress.next_review <= now
        )
        .all()
    )

    return [
        {
            "flashcard_id": f.id,
            "question_text": f.question_text,
            "explanation": f.explanation,
            "difficulty": f.difficulty,
        }
        for f in due_cards
    ]
