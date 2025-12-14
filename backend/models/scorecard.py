"""
Scorecard model for quiz score tracking.
Includes proper indexes for analytics queries.
"""

from backend.database import Base
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Index
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid


class Scorecard(Base):
    __tablename__ = "scorecard"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))

    # Required foreign keys - NOT NULL with CASCADE DELETE
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

    # Quiz reference (optional - added for tracking)
    quiz_id = Column(
        String(36),
        ForeignKey("quiz.id", ondelete="SET NULL"),
        nullable=True
    )

    # Score data - required
    score = Column(Integer, nullable=False)
    total_questions = Column(Integer, nullable=False)
    difficulty = Column(String(50))  # 'basic', 'medium', 'hard'
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)

    # Relationships
    student = relationship("Student", back_populates="scorecards")
    subject = relationship("Subject")
    chapter = relationship("Chapter")
    quiz = relationship("Quiz")

    # Composite indexes for analytics
    __table_args__ = (
        Index('ix_scorecard_student_timestamp', 'student_id', 'timestamp'),
        Index('ix_scorecard_student_subject_chapter', 'student_id', 'subject_id', 'chapter_id'),
    )
