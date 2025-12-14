"""
Student model with proper indexes and constraints.
"""

from backend.database import Base
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Text, Index
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid


class Student(Base):
    __tablename__ = "students"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), nullable=False)
    email = Column(String(200), unique=True, nullable=False, index=True)
    password = Column(String(200))

    # FK references (preferred)
    board_id = Column(String(36), ForeignKey("boards.id", ondelete="SET NULL"), nullable=True)
    grade_id = Column(String(36), ForeignKey("grades.id", ondelete="SET NULL"), nullable=True)
    language_id = Column(String(36), ForeignKey("languages.id", ondelete="SET NULL"), nullable=True)

    # Legacy string columns (kept for backward compatibility during migration)
    grade_band = Column(String(20))
    board = Column(String(50))
    medium = Column(String(50))

    # Use Boolean instead of Integer for is_active
    is_active = Column(Boolean, default=True, nullable=False)
    phone = Column(String(20), unique=True, nullable=True, index=True)
    auth_provider = Column(String(20))  # "email_password" | "phone_otp"
    goal = Column(String(50))  # "Exam marks" | "Concept clarity" | "Revision"
    preferred_subject_ids = Column(Text)  # JSON-encoded list of subject IDs
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    board_ref = relationship("Board", foreign_keys=[board_id])
    grade_ref = relationship("Grade", foreign_keys=[grade_id])
    language_ref = relationship("Language", foreign_keys=[language_id])

    # Back-references for cascade operations
    flashcards = relationship("Flashcard", back_populates="student", cascade="all, delete-orphan")
    scorecards = relationship("Scorecard", back_populates="student", cascade="all, delete-orphan")
    progress_records = relationship("StudentProgress", back_populates="student", cascade="all, delete-orphan")
    game_state = relationship("StudentGameState", back_populates="student", uselist=False, cascade="all, delete-orphan")

    # Indexes
    __table_args__ = (
        Index('ix_students_board_grade', 'board_id', 'grade_id'),
    )
