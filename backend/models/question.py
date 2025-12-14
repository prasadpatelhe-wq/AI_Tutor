"""
Question model for quiz questions.
Includes proper NOT NULL constraints and CASCADE DELETE.
"""

from backend.database import Base
from sqlalchemy import Column, Text, ForeignKey, String
from sqlalchemy.orm import relationship
import uuid


class Question(Base):
    __tablename__ = "question"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))

    # Required FK with CASCADE DELETE
    quiz_id = Column(
        String(36),
        ForeignKey("quiz.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    # Question content - required
    question_text = Column(Text, nullable=False)
    options = Column(Text)  # JSON string
    correct_option = Column(String(255))
    explanation = Column(Text)
    type = Column(String(50))  # "mcq" | "true_false" | "fill_in_the_blank" | etc.
    difficulty = Column(String(50))

    # Relationship
    quiz = relationship("Quiz", back_populates="questions")
