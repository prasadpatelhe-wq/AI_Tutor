# backend/models/chapter.py

from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from backend.database import Base

class Chapter(Base):
    __tablename__ = "chapters"

    id = Column(Integer, primary_key=True)
    title = Column(String(255), nullable=False)
    summary = Column(Text)

    subject_id = Column(Integer, ForeignKey("subjects.id"))
    textbook_id = Column(Integer, ForeignKey("textbook.id"))

    chapter_number = Column(Integer)
    description = Column(Text)
    difficulty = Column(String(50), default="medium")
    is_optional = Column(Boolean, default=False)
    order_in_book = Column(Integer)

    # ---------------------------
    # RELATIONSHIPS
    # ---------------------------

    # ✔ Correct relationship to Subject model
    subject = relationship("Subject", back_populates="chapters")

    # ✔ Correct relationship to Textbook model
    textbook = relationship("Textbook", back_populates="chapters")

    # ✔ Topics associated with chapter
    topics = relationship("Topic", back_populates="chapter")

    # ✔ Roadmap steps consist of chapters
    roadmap_steps = relationship("RoadmapStep", back_populates="chapter")

    # ✔ Quizzes mapped to chapter
    quizzes = relationship("Quiz", back_populates="chapter")
