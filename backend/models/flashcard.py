"""
Flashcard model with proper indexes, NOT NULL constraints, and CASCADE DELETE.
"""

from backend.database import Base
from sqlalchemy import Column, Text, String, ForeignKey, DateTime, Index
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid


class Flashcard(Base):
    __tablename__ = "flashcard"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))

    # Required foreign keys - NOT NULL
    student_id = Column(
        String(36),
        ForeignKey("students.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
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
    # Optional - subchapter may not always exist
    subchapter_id = Column(
        String(36),
        ForeignKey("subchapters.id", ondelete="SET NULL"),
        nullable=True
    )

    # Content - question_text is required
    question_text = Column(Text, nullable=False)
    correct_option = Column(String(255))
    explanation = Column(Text)
    difficulty = Column(String(50))
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

    # Relationships
    student = relationship("Student", back_populates="flashcards")
    subject = relationship("Subject")
    chapter = relationship("Chapter")
    subchapter = relationship("Subchapter")

    # Composite indexes for common queries
    __table_args__ = (
        Index('ix_flashcard_student_subject_chapter', 'student_id', 'subject_id', 'chapter_id'),
        Index('ix_flashcard_student_created', 'student_id', 'created_at'),
    )
