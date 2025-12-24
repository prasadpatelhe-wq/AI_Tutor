from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.roadmap import Roadmap
from backend.models.roadmap_step import RoadmapStep
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/roadmap", tags=["Roadmap"])


class RoadmapCreate(BaseModel):
    syllabus_subject_id: int
    textbook_id: Optional[int] = None
    name: str
    description: Optional[str] = None
    total_weeks: Optional[int] = None
    target_exam_month: Optional[str] = None


class RoadmapStepCreate(BaseModel):
    step_number: int
    week_number: Optional[int] = None
    chapter_id: Optional[int] = None
    topic_id: Optional[int] = None
    activity_type: Optional[str] = "learn"
    estimated_hours: Optional[float] = None
    notes: Optional[str] = None


@router.post("/")
def create_roadmap(req: RoadmapCreate, db: Session = Depends(get_db)):
    roadmap = Roadmap(**req.model_dump())
    db.add(roadmap)
    db.commit()
    db.refresh(roadmap)
    return {"message": "created", "roadmap_id": roadmap.id}


@router.post("/{roadmap_id}/step")
def add_step(roadmap_id: int, req: RoadmapStepCreate, db: Session = Depends(get_db)):
    step = RoadmapStep(roadmap_id=roadmap_id, **req.model_dump())
    db.add(step)
    db.commit()
    db.refresh(step)
    return {"message": "step added", "step_id": step.id}


@router.get("/{roadmap_id}")
def get_roadmap(roadmap_id: int, db: Session = Depends(get_db)):
    roadmap = db.query(Roadmap).filter(Roadmap.id == roadmap_id).first()
    if not roadmap:
        raise HTTPException(404, "Roadmap not found")

    steps = (
        db.query(RoadmapStep)
        .filter(RoadmapStep.roadmap_id == roadmap_id)
        .order_by(RoadmapStep.step_number)
        .all()
    )

    return {
        "roadmap": {
            "id": roadmap.id,
            "name": roadmap.name,
            "description": roadmap.description,
            "total_weeks": roadmap.total_weeks,
            "target_exam_month": roadmap.target_exam_month,
        },
        "steps": [
            {
                "id": s.id,
                "step_number": s.step_number,
                "week_number": s.week_number,
                "chapter_id": s.chapter_id,
                "topic_id": s.topic_id,
                "activity_type": s.activity_type,
                "estimated_hours": s.estimated_hours,
                "notes": s.notes,
            }
            for s in steps
        ],
    }
