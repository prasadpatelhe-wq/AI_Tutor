from backend.database import Base
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

class Scorecard(Base):
    __tablename__ = "scorecard"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=True) # Nullable for now if no student login
    subject_id = Column(Integer, ForeignKey("subjects.id"))
    chapter_id = Column(Integer, ForeignKey("chapters.id"))
    
    score = Column(Integer)
    total_questions = Column(Integer)
    difficulty = Column(String(50)) # 'basic', 'medium', 'hard'
    timestamp = Column(DateTime, default=datetime.utcnow)

    # Relationships
    student = relationship("Student")
    subject = relationship("Subject")
    chapter = relationship("Chapter")
