# backend/routers/chapters_router.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import SessionLocal
from backend.models.chapter import Chapter


router = APIRouter(prefix="/chapters", tags=["Chapters"])


# -------------------------
# DB Dependency
# -------------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ============================================================
# 1️⃣ GET all chapters (optional, useful for debugging)
# ============================================================
@router.get("/")
def get_all_chapters(db: Session = Depends(get_db)):
    chapters = db.query(Chapter).order_by(Chapter.id).all()

    return [
        {
            "id": c.id,
            "title": c.title,
            "summary": c.summary or "",
            "subject_id": c.subject_id,
            "textbook_id": c.textbook_id,
            "chapter_number": c.chapter_number,
            "order_in_book": c.order_in_book,
        }
        for c in chapters
    ]


# ============================================================
# 2️⃣ GET chapters by subject_id
# Used when user selects subject → frontend dropdown
# ============================================================
@router.get("/by_subject/{subject_id}")
def get_chapters_by_subject(subject_id: int, db: Session = Depends(get_db)):
    chapters = (
        db.query(Chapter)
        .filter(Chapter.subject_id == subject_id)
        .order_by(Chapter.order_in_book, Chapter.chapter_number)
        .all()
    )

    if not chapters:
        raise HTTPException(404, detail="No chapters found for this subject")

    return [
        {
            "id": c.id,
            "title": c.title,
            "summary": c.summary or "",
            "subject_id": c.subject_id,
            "chapter_number": c.chapter_number,
            "order_in_book": c.order_in_book,
        }
        for c in chapters
    ]


# ============================================================
# 3️⃣ GET chapter by ID
# Used by frontend → generateQuiz() to fetch full chapter info
# ============================================================
@router.get("/{chapter_id}")
def get_chapter_by_id(chapter_id: int, db: Session = Depends(get_db)):
    chapter = db.query(Chapter).filter(Chapter.id == chapter_id).first()

    if not chapter:
        raise HTTPException(404, detail=f"Chapter with ID {chapter_id} not found")

    return {
        "id": chapter.id,
        "title": chapter.title,
        "summary": chapter.summary or "",
        "subject_id": chapter.subject_id,
        "textbook_id": chapter.textbook_id,
        "chapter_number": chapter.chapter_number,
        "difficulty": chapter.difficulty,
        "is_optional": chapter.is_optional,
        "order_in_book": chapter.order_in_book,
    }
