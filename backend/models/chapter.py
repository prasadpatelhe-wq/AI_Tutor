"""
Chapter model with proper indexes and constraints.
"""

from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Index, UniqueConstraint
from sqlalchemy.orm import relationship
from backend.database import Base
from datetime import datetime
import uuid


class Chapter(Base):
    __tablename__ = "chapters"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    subject_id = Column(
        String(36),
        ForeignKey("subjects.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    chapter_no = Column(Integer)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    order_index = Column(Integer, default=0, index=True)

    # Versioning
    version = Column(Integer, default=1)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    subject = relationship("Subject", back_populates="chapters")
    subchapters = relationship("Subchapter", back_populates="chapter", cascade="all, delete-orphan")

    # Constraints and indexes
    __table_args__ = (
        UniqueConstraint('subject_id', 'chapter_no', name='uq_subject_chapter_no'),
        Index('ix_chapter_subject_order', 'subject_id', 'order_index'),
    )
