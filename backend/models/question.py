from sqlalchemy import Column, Integer, String, Text, ForeignKey, JSON, DateTime, func
from backend.database import Base

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id"))
    question_text = Column(Text, nullable=False)
    options = Column(JSON, nullable=False)  # store ["A", "B", "C", "D"]
    correct_option = Column(String(255), nullable=False)
    explanation = Column(Text)
    created_at = Column(DateTime, server_default=func.now())
