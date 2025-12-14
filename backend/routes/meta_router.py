"""
Meta Router - Provides metadata endpoints for grades, boards, subjects, and languages.
Uses shared dependencies for database access.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

# Use shared dependencies
from backend.utils.dependencies import get_db

from backend.models.grade import Grade
from backend.models.board import Board
from backend.models.subject import Subject
from backend.models.language import Language

router = APIRouter(prefix="/meta", tags=["Metadata"])


@router.get("/grades")
def get_grades(db: Session = Depends(get_db)):
    """Get all available grades."""
    grades = db.query(Grade).order_by(Grade.grade_name).all()
    return [
        {"id": g.id, "name": g.grade_name, "display": g.display_name}
        for g in grades
    ]


@router.get("/boards")
def get_boards(db: Session = Depends(get_db)):
    """Get all available educational boards."""
    boards = db.query(Board).order_by(Board.name).all()
    return [{"id": b.id, "name": b.name, "description": b.description} for b in boards]


@router.get("/subjects")
def get_subjects(db: Session = Depends(get_db)):
    """Get all available subjects."""
    subjects = db.query(Subject).order_by(Subject.order_index, Subject.name).all()
    return [{"id": s.id, "name": s.name, "code": s.code} for s in subjects]


@router.get("/languages")
def get_languages(db: Session = Depends(get_db)):
    """Get all available languages."""
    langs = db.query(Language).order_by(Language.name).all()
    return [
        {"id": lang.id, "code": lang.code, "name": lang.name, "direction": lang.direction}
        for lang in langs
    ]
