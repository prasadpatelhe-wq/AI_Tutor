from backend.database import Base
from sqlalchemy import Column, Integer, String, ForeignKey, Text
from sqlalchemy.orm import relationship

class Quiz(Base):
    __tablename__ = "quiz"

    id = Column(Integer, primary_key=True)

    subject_id = Column(Integer, ForeignKey("subjects.id"))
    grade_band = Column(String(50))

    chapter_id = Column(Integer, ForeignKey("chapters.id"))
    difficulty = Column(String(50))

    subject = relationship("Subject")

    # FIXED: MUST match "quizzes" in chapter.py
    chapter = relationship("Chapter", back_populates="quizzes")

    questions = relationship("Question", back_populates="quiz")
    roadmap_links = relationship("RoadmapQuizMap", back_populates="quiz")
