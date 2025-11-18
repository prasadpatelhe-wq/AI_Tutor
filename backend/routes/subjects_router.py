# backend/routers/subjects_router.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import SessionLocal
from backend.models.subject import Subject

router = APIRouter(prefix="/subjects", tags=["Subjects"])


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
# 1️⃣ GET all subjects (optional)
# ============================================================
@router.get("/")
def get_all_subjects(db: Session = Depends(get_db)):
    subjects = db.query(Subject).order_by(Subject.id).all()

    return [
        {
            "id": s.id,
            "code": s.code,
            "name": s.name,
        }
        for s in subjects
    ]


# ============================================================
# 2️⃣ GET subject BY NAME or CODE (case-insensitive)
# Frontend calls: /subjects/get_by_name?name=Math
# ============================================================
@router.get("/get_by_name")
def get_subject_by_name(name: str, db: Session = Depends(get_db)):
    name_clean = name.strip().lower()

    subject = (
        db.query(Subject)
        .filter(
            (Subject.name.ilike(name_clean)) |
            (Subject.code.ilike(name_clean)) |
            (Subject.name.ilike(f"%{name_clean}%")) |
            (Subject.code.ilike(f"%{name_clean}%"))
        )
        .first()
    )

    if not subject:
        raise HTTPException(404, detail="Subject not found in database!")

    return {
        "id": subject.id,
        "code": subject.code,
        "name": subject.name,
    }
@router.get("/get/{subject_id}")
def get_subject_by_id(subject_id: int, db: Session = Depends(get_db)):
    subject = db.query(Subject).filter(Subject.id == subject_id).first()

    if not subject:
        raise HTTPException(404, "Subject ID not found")

    return {
        "id": subject.id,
        "code": subject.code,
        "name": subject.name,
    }