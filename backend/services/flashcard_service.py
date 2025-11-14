"""
Flashcard Service
Handles storing and retrieving quiz explanations (as flashcards)
Now includes student-based linking for personalized flashcard tracking.
Automatically assigns student_id if missing.
"""

from sqlalchemy.orm import Session
from backend.models.flashcard import Flashcard
from backend.models.subject import Subject
from backend.models.chapter import Chapter
from backend.models.students import Student
from backend.models.student_progress import StudentProgress
from backend.database import SessionLocal
from datetime import datetime


def get_db():
    """Utility function to get a new DB session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# -----------------------------------------------------------
# Save flashcards after a quiz
# -----------------------------------------------------------
def save_flashcards_from_quiz(
    quiz_data: dict,
    subject_name: str,
    chapter_title: str,
    db: Session,
    student_id: int = None
):
    """
    Saves quiz questions as flashcards.
    ✅ Automatically links them to a student (if not provided).
    """

    from backend.models.quiz import Quiz
    from backend.models.question import Question

    # 1️⃣ Auto-detect student if not provided
    if student_id is None:
        student = db.query(Student).first()
        if not student:
            raise Exception("❌ No student found in database. Please add one first.")
        student_id = student.id

    # 2️⃣ Get or create subject
    subject = db.query(Subject).filter(Subject.name == subject_name).first()
    if not subject:
        subject = Subject(name=subject_name)
        db.add(subject)
        db.commit()
        db.refresh(subject)

    # 3️⃣ Get or create chapter
    chapter = db.query(Chapter).filter(
        Chapter.title == chapter_title,
        Chapter.subject_id == subject.id
    ).first()
    if not chapter:
        chapter = Chapter(title=chapter_title, subject_id=subject.id)
        db.add(chapter)
        db.commit()
        db.refresh(chapter)

    # 4️⃣ Create quiz record
    quiz = Quiz(
        subject_id=subject.id,
        chapter_id=chapter.id,
        grade_band=quiz_data.get("grade_band", ""),
        difficulty=quiz_data.get("difficulty", "basic")
    )
    db.add(quiz)
    db.commit()
    db.refresh(quiz)

    # 5️⃣ Save questions + flashcards
    for q in quiz_data.get("questions", []):
        correct_option = None
        options = q.get("options", [])
        idx = q.get("correct_option_index")
        if isinstance(idx, int) and 0 <= idx < len(options):
            correct_option = options[idx]

        # Save question
        question = Question(
            quiz_id=quiz.id,
            question_text=q.get("question_text"),
            options=options,
            correct_option=correct_option or "",
            explanation=q.get("explanation", "")
        )
        db.add(question)
        db.commit()
        db.refresh(question)

        # Save flashcard (always linked to a student)
        flashcard = Flashcard(
            quiz_id=quiz.id,
            question_text=q.get("question_text"),
            correct_option=correct_option,
            explanation=q.get("explanation", ""),
            subject_id=subject.id,
            chapter_id=chapter.id,
            difficulty=quiz_data.get("difficulty", "basic"),
            student_id=student_id
        )
        db.add(flashcard)
        db.commit()
        db.refresh(flashcard)

        # Add progress tracking entry
        progress = StudentProgress(
            student_id=student_id,
            flashcard_id=flashcard.id,
            status="new",
            attempts=0,
            last_reviewed=datetime.now(),
            next_review=None
        )
        db.add(progress)
        db.commit()

    return {"message": f"✅ Flashcards saved for {subject_name} - {chapter_title} (Student ID: {student_id})"}


# -----------------------------------------------------------
# Fetch flashcards (by subject & chapter)
# -----------------------------------------------------------
def get_flashcards(subject_name: str, chapter_title: str, db: Session, student_id: int = None):
    """
    Retrieves stored flashcards by subject and chapter.
    If student_id is provided, only fetches flashcards linked to that student.
    """
    subject = db.query(Subject).filter(Subject.name == subject_name).first()
    if not subject:
        return []

    chapter = db.query(Chapter).filter(
        Chapter.title == chapter_title,
        Chapter.subject_id == subject.id
    ).first()

    if not chapter:
        return []

    query = db.query(Flashcard).filter(
        Flashcard.subject_id == subject.id,
        Flashcard.chapter_id == chapter.id
    )

    if student_id:
        query = query.filter(Flashcard.student_id == student_id)

    flashcards = query.all()

    return [
        {
            "id": f.id,
            "question_text": f.question_text,
            "explanation": f.explanation,
            "difficulty": f.difficulty,
            "created_at": str(f.created_at)
        }
        for f in flashcards
    ]
