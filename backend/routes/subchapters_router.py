# backend/routes/subchapters_router.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import SessionLocal
from backend.models.subchapter import Subchapter

router = APIRouter(prefix="/subchapters", tags=["Subchapters"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/by_chapter/{chapter_id}")
def get_subchapters_by_chapter(chapter_id: str, db: Session = Depends(get_db)):
    subs = (
        db.query(Subchapter)
        .filter(Subchapter.chapter_id == chapter_id)
        .order_by(Subchapter.order_index, Subchapter.subchapter_no)
        .all()
    )

    if not subs:
        raise HTTPException(404, detail="No subchapters found for this chapter")

    return [
        {
            "id": s.id,
            "title": s.title,
            "description": s.description or "",
            "chapter_id": s.chapter_id,
            "subchapter_no": s.subchapter_no,
            "order_index": s.order_index,
        }
        for s in subs
    ]


@router.get("/{subchapter_id}")
def get_subchapter_by_id(subchapter_id: str, db: Session = Depends(get_db)):
    sub = db.query(Subchapter).filter(Subchapter.id == subchapter_id).first()
    if not sub:
        raise HTTPException(404, detail=f"Subchapter with ID {subchapter_id} not found")
    return {
        "id": sub.id,
        "title": sub.title,
        "description": sub.description or "",
        "chapter_id": sub.chapter_id,
        "subchapter_no": sub.subchapter_no,
        "order_index": sub.order_index,
    }
