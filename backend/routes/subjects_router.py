"""
Subjects Router - Handles subject lookup and retrieval.
Uses shared dependencies for database access.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

# Use shared dependencies
from backend.utils.dependencies import get_db

from backend.models.subject import Subject

router = APIRouter(prefix="/subjects", tags=["Subjects"])


@router.get("/")
def get_all_subjects(db: Session = Depends(get_db)):
    """Get all subjects ordered by display order."""
    subjects = db.query(Subject).order_by(Subject.order_index, Subject.name).all()

    return [
        {
            "id": s.id,
            "code": s.code,
            "name": s.name,
            "syllabus_id": s.syllabus_id,
        }
        for s in subjects
    ]


@router.get("/get_by_name")
def get_subject_by_name(name: str, db: Session = Depends(get_db)):
    """
    Get subject by name or code (case-insensitive).
    Supports partial matching for flexibility.
    """
    name_clean = name.strip().lower()

    # First try exact match
    subject = (
        db.query(Subject)
        .filter(
            (Subject.name.ilike(name_clean)) |
            (Subject.code.ilike(name_clean))
        )
        .first()
    )

    # If no exact match, try partial match
    if not subject:
        subject = (
            db.query(Subject)
            .filter(
                (Subject.name.ilike(f"%{name_clean}%")) |
                (Subject.code.ilike(f"%{name_clean}%"))
            )
            .first()
        )

    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found in database")

    return {
        "id": subject.id,
        "code": subject.code,
        "name": subject.name,
        "syllabus_id": subject.syllabus_id,
    }


@router.get("/get/{subject_id}")
def get_subject_by_id(subject_id: str, db: Session = Depends(get_db)):
    """Get subject by ID."""
    subject = db.query(Subject).filter(Subject.id == subject_id).first()

    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")

    return {
        "id": subject.id,
        "code": subject.code,
        "name": subject.name,
        "syllabus_id": subject.syllabus_id,
    }
