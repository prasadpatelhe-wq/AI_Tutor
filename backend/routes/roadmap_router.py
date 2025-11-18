from fastapi import APIRouter, HTTPException
from backend.database import SessionLocal
from backend.models.roadmap import Roadmap
from backend.models.roadmap_step import RoadmapStep
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/roadmap", tags=["Roadmap"])


class RoadmapCreate(BaseModel):
    syllabus_subject_id: int
    textbook_id: Optional[int]
    name: str
    description: Optional[str]
    total_weeks: Optional[int]
    target_exam_month: Optional[str]


class RoadmapStepCreate(BaseModel):
    step_number: int
    week_number: Optional[int]
    chapter_id: Optional[int]
    topic_id: Optional[int]
    activity_type: Optional[str] = "learn"
    estimated_hours: Optional[float]
    notes: Optional[str]


@router.post("/")
def create_roadmap(req: RoadmapCreate):
    db = SessionLocal()
    try:
        roadmap = Roadmap(**req.dict())
        db.add(roadmap)
        db.commit()
        db.refresh(roadmap)
        return {"message": "created", "roadmap_id": roadmap.id}
    finally:
        db.close()


@router.post("/{roadmap_id}/step")
def add_step(roadmap_id: int, req: RoadmapStepCreate):
    db = SessionLocal()
    try:
        step = RoadmapStep(roadmap_id=roadmap_id, **req.dict())
        db.add(step)
        db.commit()
        db.refresh(step)
        return {"message": "step added", "step_id": step.id}
    finally:
        db.close()


@router.get("/{roadmap_id}")
def get_roadmap(roadmap_id: int):
    db = SessionLocal()
    try:
        roadmap = db.query(Roadmap).filter(Roadmap.id == roadmap_id).first()
        if not roadmap:
            raise HTTPException(404, "Roadmap not found")

        steps = db.query(RoadmapStep).filter(RoadmapStep.roadmap_id == roadmap_id).order_by(RoadmapStep.step_number).all()

        return {
            "roadmap": {
                "id": roadmap.id,
                "name": roadmap.name,
                "description": roadmap.description,
                "total_weeks": roadmap.total_weeks,
                "target_exam_month": roadmap.target_exam_month,
            },
            "steps": [s.__dict__ for s in steps],
        }
    finally:
        db.close()
