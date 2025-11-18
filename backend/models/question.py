from backend.database import Base
from sqlalchemy import Column, Integer, Text, ForeignKey, String
from sqlalchemy.orm import relationship


class Question(Base):
    __tablename__ = "question"

    id = Column(Integer, primary_key=True)
    quiz_id = Column(Integer, ForeignKey("quiz.id"))

    question_text = Column(Text)
    options = Column(Text)  # JSON string
    correct_option = Column(String(255), nullable=True)
    explanation = Column(Text)
    type = Column(String(50))
    difficulty = Column(String(50))

    quiz = relationship("Quiz", back_populates="questions")
