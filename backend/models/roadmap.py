from backend.database import Base
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime


class Roadmap(Base):
    __tablename__ = "roadmap"

    id = Column(Integer, primary_key=True)
    syllabus_subject_id = Column(Integer, ForeignKey("syllabus_subject.id"))
    textbook_id = Column(Integer, ForeignKey("textbook.id"), nullable=True)

    name = Column(String(255))
    description = Column(Text)
    total_weeks = Column(Integer)
    target_exam_month = Column(String(50))
    is_default = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    syllabus_subject = relationship("SyllabusSubject", back_populates="roadmaps")
    textbook = relationship("Textbook", back_populates="roadmaps")

    steps = relationship("RoadmapStep", back_populates="roadmap")
