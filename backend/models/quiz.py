from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, func
from backend.database import Base

class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(Integer, primary_key=True, index=True)
    subject_id = Column(Integer, ForeignKey("subjects.id"))
    chapter_id = Column(Integer, ForeignKey("chapters.id"))
    grade_band = Column(String(50), nullable=False)
    difficulty = Column(String(20), nullable=False)
    created_at = Column(DateTime, server_default=func.now())
