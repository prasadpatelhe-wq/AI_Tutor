from backend.database import Base
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

class Scorecard(Base):
    __tablename__ = "scorecard"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    student_id = Column(String(36), ForeignKey("students.id"), nullable=True)
    subject_id = Column(String(36), ForeignKey("subjects.id"))
    chapter_id = Column(String(36), ForeignKey("chapters.id"))
    
    score = Column(Integer)
    total_questions = Column(Integer)
    difficulty = Column(String(50)) # 'basic', 'medium', 'hard'
    timestamp = Column(DateTime, default=datetime.utcnow)

    # Relationships
    student = relationship("Student")
    subject = relationship("Subject")
    chapter = relationship("Chapter")
