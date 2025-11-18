from backend.database import Base
from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship


class RoadmapQuizMap(Base):
    __tablename__ = "roadmap_quiz_map"

    id = Column(Integer, primary_key=True)
    step_id = Column(Integer, ForeignKey("roadmap_step.id"))
    quiz_id = Column(Integer, ForeignKey("quiz.id"))

    roadmap_step = relationship("RoadmapStep", back_populates="quiz_links")
    quiz = relationship("Quiz", back_populates="roadmap_links")
