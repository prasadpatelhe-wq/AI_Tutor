# backend/models/student_progress.py
from sqlalchemy import Column, Integer, ForeignKey, String, DateTime, func
from backend.database import Base

class StudentProgress(Base):
    __tablename__ = "student_progress"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    flashcard_id = Column(Integer, ForeignKey("flashcards.id"), nullable=False)
    status = Column(String(20), default="new")  # e.g. new, reviewing, mastered
    attempts = Column(Integer, default=0)
    last_reviewed = Column(DateTime, server_default=func.now())
    next_review = Column(DateTime, nullable=True)
