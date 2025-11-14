# backend/models/flashcard.py
from sqlalchemy import Column, Integer, ForeignKey, String, Text, DateTime, func
from backend.database import Base

class Flashcard(Base):
    __tablename__ = "flashcards"

    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id"))
    question_text = Column(Text, nullable=False)
    correct_option = Column(String(255), nullable=True)
    explanation = Column(Text, nullable=True)
    subject_id = Column(Integer, ForeignKey("subjects.id"))
    chapter_id = Column(Integer, ForeignKey("chapters.id"))
    difficulty = Column(String(20))
    created_at = Column(DateTime, server_default=func.now())

    # optional personalization
    student_id = Column(Integer, ForeignKey("students.id"), nullable=True)
