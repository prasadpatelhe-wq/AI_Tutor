"""
StudentProgress model for spaced repetition tracking.
Includes unique constraint on (student_id, flashcard_id) to prevent duplicates.
"""

from datetime import datetime, timedelta

from backend.database import Base
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Index, UniqueConstraint
from sqlalchemy.orm import relationship
import uuid


def _default_next_review():
    """Default next review is 1 day from now."""
    return datetime.utcnow() + timedelta(days=1)


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

    # Progress tracking with proper defaults
    status = Column(String(50), default="new", index=True)  # "new" | "reviewing" | "mastered"
    attempts = Column(Integer, default=0, nullable=False)
    last_reviewed = Column(DateTime, default=datetime.utcnow, nullable=True)
    next_review = Column(DateTime, default=_default_next_review, index=True)

    # Relationships
    student = relationship("Student", back_populates="progress_records")
    flashcard = relationship("Flashcard")

    # Constraints and indexes
    __table_args__ = (
        # Ensure one progress record per student-flashcard pair
        UniqueConstraint('student_id', 'flashcard_id', name='uq_student_flashcard'),
        Index('ix_progress_student_next_review', 'student_id', 'next_review'),
        Index('ix_progress_status', 'status'),
    )
