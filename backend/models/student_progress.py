from backend.database import Base
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship


class StudentProgress(Base):
    __tablename__ = "student_progress"

    id = Column(Integer, primary_key=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    flashcard_id = Column(Integer, ForeignKey("flashcard.id"))

    status = Column(String(50))
    attempts = Column(Integer, default=0)
    last_reviewed = Column(DateTime)
    next_review = Column(DateTime)

    student = relationship("Student", back_populates="progress")
    flashcard = relationship("Flashcard")
