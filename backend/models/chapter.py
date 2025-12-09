# backend/models/chapter.py

from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from backend.database import Base
import uuid

class Chapter(Base):
    __tablename__ = "chapters"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    subject_id = Column(String(36), ForeignKey("subjects.id"), nullable=False)
    chapter_no = Column(Integer)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    order_index = Column(Integer)

    subject = relationship("Subject", back_populates="chapters")
    subchapters = relationship("Subchapter", back_populates="chapter")
    # quizzes = relationship("Quiz", back_populates="chapter") # Commenting out until Quiz is updated
