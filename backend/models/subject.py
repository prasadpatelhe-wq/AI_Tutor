"""
Subject model with proper indexes.
"""

from backend.database import Base
from sqlalchemy import Column, String, Integer, ForeignKey, Index, UniqueConstraint
from sqlalchemy.orm import relationship
import uuid


class Subject(Base):
    __tablename__ = "subjects"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    syllabus_id = Column(
        String(36),
        ForeignKey("syllabi.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    name = Column(String(100), nullable=False)
    code = Column(String(50))
    order_index = Column(Integer, default=0, index=True)

    # Relationships
    syllabus = relationship("Syllabus")
    chapters = relationship("Chapter", back_populates="subject", cascade="all, delete-orphan")

    # Constraints
    __table_args__ = (
        UniqueConstraint('syllabus_id', 'name', name='uq_syllabus_subject_name'),
        Index('ix_subject_syllabus_order', 'syllabus_id', 'order_index'),
    )
