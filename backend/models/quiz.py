from backend.database import Base
from sqlalchemy import Column, String, ForeignKey, Text
from sqlalchemy.orm import relationship
import uuid

class Quiz(Base):
    __tablename__ = "quiz"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))

    subject_id = Column(String(36), ForeignKey("subjects.id"))
    # grade_band = Column(String(50)) # Removed as per new schema logic (grade is in student/syllabus)

    chapter_id = Column(String(36), ForeignKey("chapters.id"))
    difficulty = Column(String(50))

    subject = relationship("Subject")
    chapter = relationship("Chapter") #, back_populates="quizzes") # Uncomment back_populates if added to Chapter

    questions = relationship("Question", back_populates="quiz")
    # roadmap_links = relationship("RoadmapQuizMap", back_populates="quiz") # Commenting out roadmap for now
