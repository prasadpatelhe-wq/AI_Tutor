from backend.database import Base
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True)
    name = Column(String(100))
    email = Column(String(200))
    grade_band = Column(String(50))
    created_at = Column(DateTime, default=datetime.utcnow)

    flashcards = relationship("Flashcard", back_populates="student")
    progress = relationship("StudentProgress", back_populates="student")
