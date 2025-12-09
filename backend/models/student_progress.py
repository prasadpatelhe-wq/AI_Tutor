from backend.database import Base
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
import uuid

class StudentProgress(Base):
    __tablename__ = "student_progress"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    student_id = Column(String(36), ForeignKey("students.id"))
    flashcard_id = Column(String(36), ForeignKey("flashcard.id"))

    status = Column(String(50))
    attempts = Column(Integer, default=0)
    last_reviewed = Column(DateTime)
    next_review = Column(DateTime)

    student = relationship("Student") #, back_populates="progress")
    flashcard = relationship("Flashcard")
