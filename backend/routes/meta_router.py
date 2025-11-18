from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.database import SessionLocal
from backend.models.grade import Grade
from backend.models.board import Board
from backend.models.subject import Subject

router = APIRouter(prefix="/meta", tags=["Metadata"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/grades")
def get_grades(db: Session = Depends(get_db)):
    grades = db.query(Grade).all()
    return [
        {"id": g.id, "name": g.grade_name, "display": g.display_name}
        for g in grades
    ]


@router.get("/boards")
def get_boards(db: Session = Depends(get_db)):
    boards = db.query(Board).all()
    return [{"id": b.id, "name": b.name} for b in boards]


@router.get("/subjects")
def get_subjects(db: Session = Depends(get_db)):
    subjects = db.query(Subject).all()
    return [{"id": s.id, "name": s.name} for s in subjects]
