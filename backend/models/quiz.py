"""
Quiz model for storing generated quizzes.
Includes proper indexes and NOT NULL constraints.
"""

from backend.database import Base
from sqlalchemy import Column, String, ForeignKey, DateTime, Index
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid


class Quiz(Base):
    __tablename__ = "quiz"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))

    # Required foreign keys - NOT NULL
    subject_id = Column(
        String(36),
        ForeignKey("subjects.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    chapter_id = Column(
        String(36),
        ForeignKey("chapters.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    # Quiz metadata
    difficulty = Column(String(50), nullable=False, default="basic")
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

    # Relationships
    subject = relationship("Subject")
    chapter = relationship("Chapter")
    questions = relationship("Question", back_populates="quiz", cascade="all, delete-orphan")

    # Composite indexes
    __table_args__ = (
        Index('ix_quiz_subject_chapter_difficulty', 'subject_id', 'chapter_id', 'difficulty'),
    )
