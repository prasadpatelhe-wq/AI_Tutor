from backend.database import Base
from sqlalchemy import Column, Text, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

class Flashcard(Base):
    __tablename__ = "flashcard"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    student_id = Column(String(36), ForeignKey("students.id"))
    subject_id = Column(String(36), ForeignKey("subjects.id"))
    chapter_id = Column(String(36), ForeignKey("chapters.id"))
    subchapter_id = Column(String(36), ForeignKey("subchapters.id"), nullable=True)

    question_text = Column(Text)
    correct_option = Column(String(255))
    explanation = Column(Text)
    difficulty = Column(String(50))
    created_at = Column(DateTime, default=datetime.utcnow)

    student = relationship("Student") #, back_populates="flashcards") # Uncomment if needed
    subject = relationship("Subject")
    chapter = relationship("Chapter")
