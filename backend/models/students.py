from backend.database import Base
from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True)
    name = Column(String(100))
    email = Column(String(200))
    grade_band = Column(String(50))
    board = Column(String(50))  # e.g., CBSE, ICSE, State
    password = Column(String(200))  # Storing hashed password
    is_active = Column(Integer, default=1)  # 1 for active, 0 for inactive (using Integer for SQLite boolean compatibility if needed, but Boolean works too)
    created_at = Column(DateTime, default=datetime.utcnow)

    flashcards = relationship("Flashcard", back_populates="student")
    progress = relationship("StudentProgress", back_populates="student")
