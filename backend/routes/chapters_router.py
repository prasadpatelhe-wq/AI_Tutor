"""
Chapters Router - Handles chapter retrieval by subject and ID.
Uses shared dependencies for database access.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

# Use shared dependencies
from backend.utils.dependencies import get_db

from backend.models.chapter import Chapter

router = APIRouter(prefix="/chapters", tags=["Chapters"])


@router.get("/")
def get_all_chapters(db: Session = Depends(get_db)):
    """Get all chapters (useful for debugging)."""
    chapters = db.query(Chapter).order_by(Chapter.subject_id, Chapter.order_index).all()

    return [
        {
            "id": c.id,
            "title": c.title,
            "summary": c.description or "",
            "subject_id": c.subject_id,
            "chapter_number": c.chapter_no,
            "order_in_book": c.order_index,
        }
        for c in chapters
    ]


@router.get("/by_subject/{subject_id}")
def get_chapters_by_subject(subject_id: str, db: Session = Depends(get_db)):
    """
    Get all chapters for a given subject.
    Used when user selects subject in frontend dropdown.
    """
    chapters = (
        db.query(Chapter)
        .filter(Chapter.subject_id == subject_id)
        .order_by(Chapter.order_index, Chapter.chapter_no)
        .all()
    )

    # Return empty list instead of 404 for valid subjects with no chapters
    return [
        {
            "id": c.id,
            "title": c.title,
            "summary": c.description or "",
            "subject_id": c.subject_id,
            "chapter_number": c.chapter_no,
            "order_in_book": c.order_index,
        }
        for c in chapters
    ]


@router.get("/{chapter_id}")
def get_chapter_by_id(chapter_id: str, db: Session = Depends(get_db)):
    """
    Get chapter by ID.
    Used by frontend to fetch full chapter info for quiz generation.
    """
    chapter = db.query(Chapter).filter(Chapter.id == chapter_id).first()

    if not chapter:
        raise HTTPException(status_code=404, detail=f"Chapter with ID {chapter_id} not found")

    return {
        "id": chapter.id,
        "title": chapter.title,
        "summary": chapter.description or "",
        "subject_id": chapter.subject_id,
        "chapter_number": chapter.chapter_no,
        "order_in_book": chapter.order_index,
    }
