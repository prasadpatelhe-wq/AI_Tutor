from backend.database import Base
from sqlalchemy import Column, String, Integer, DateTime
from datetime import datetime
import uuid

class Student(Base):
    __tablename__ = "students"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), nullable=False)
    email = Column(String(200), unique=True, nullable=False)
    password = Column(String(200))  # Keeping password for auth

    grade_band = Column(String(20))
    board = Column(String(50))  # Board name/code (not an FK for now)
    medium = Column(String(50))  # Language/medium of instruction
    is_active = Column(Integer, default=1)

    phone = Column(String(20))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # flashcards = relationship("Flashcard", back_populates="student") # Commenting out until Flashcard is updated
    # progress = relationship("StudentProgress", back_populates="student") # Commenting out until StudentProgress is updated
