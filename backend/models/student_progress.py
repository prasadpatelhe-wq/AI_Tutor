"""
StudentProgress model for spaced repetition tracking.
Includes unique constraint on (student_id, flashcard_id) to prevent duplicates.
"""

from backend.database import Base
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Index, UniqueConstraint
from sqlalchemy.orm import relationship
import uuid


class StudentProgress(Base):
    __tablename__ = "student_progress"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))

    # Required foreign keys - NOT NULL with CASCADE DELETE
    student_id = Column(
        String(36),
        ForeignKey("students.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    flashcard_id = Column(
        String(36),
        ForeignKey("flashcard.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    # Progress tracking
    status = Column(String(50), default="new")  # "new" | "reviewing" | "mastered"
    attempts = Column(Integer, default=0, nullable=False)
    last_reviewed = Column(DateTime)
    next_review = Column(DateTime, index=True)  # Index for due flashcards query

    # Relationships
    student = relationship("Student", back_populates="progress_records")
    flashcard = relationship("Flashcard")

    # Constraints and indexes
    __table_args__ = (
        # Ensure one progress record per student-flashcard pair
        UniqueConstraint('student_id', 'flashcard_id', name='uq_student_flashcard'),
        Index('ix_progress_student_next_review', 'student_id', 'next_review'),
    )
