"""
Subchapter model with proper indexes and constraints.
"""

from backend.database import Base
from sqlalchemy import Column, String, Text, Integer, ForeignKey, DateTime, Index
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid


class Subchapter(Base):
    __tablename__ = "subchapters"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    chapter_id = Column(
        String(36),
        ForeignKey("chapters.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    subchapter_no = Column(String(20))  # Changed from Text to String for better indexing
    title = Column(String(255), nullable=False)  # Changed from Text to String
    description = Column(Text)
    order_index = Column(Integer, default=0, index=True)

    # Versioning
    version = Column(Integer, default=1)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    chapter = relationship("Chapter", back_populates="subchapters")

    # Indexes
    __table_args__ = (
        Index('ix_subchapter_chapter_order', 'chapter_id', 'order_index'),
    )
