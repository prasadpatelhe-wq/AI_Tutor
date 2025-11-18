from backend.database import Base
from sqlalchemy import Column, Integer, Text, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime


class Flashcard(Base):
    __tablename__ = "flashcard"

    id = Column(Integer, primary_key=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    subject_id = Column(Integer, ForeignKey("subjects.id"))
    chapter_id = Column(Integer, ForeignKey("chapters.id"))

    question_text = Column(Text)
    correct_option = Column(String(255))
    explanation = Column(Text)
    difficulty = Column(String(50))
    created_at = Column(DateTime, default=datetime.utcnow)

    student = relationship("Student", back_populates="flashcards")
    subject = relationship("Subject")
    chapter = relationship("Chapter")
