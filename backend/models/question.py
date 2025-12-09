from backend.database import Base
from sqlalchemy import Column, Text, ForeignKey, String
from sqlalchemy.orm import relationship
import uuid

class Question(Base):
    __tablename__ = "question"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    quiz_id = Column(String(36), ForeignKey("quiz.id"))

    question_text = Column(Text)
    options = Column(Text)  # JSON string
    correct_option = Column(String(255), nullable=True)
    explanation = Column(Text)
    type = Column(String(50))
    difficulty = Column(String(50))

    quiz = relationship("Quiz", back_populates="questions")
