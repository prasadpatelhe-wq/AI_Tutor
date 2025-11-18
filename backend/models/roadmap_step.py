from backend.database import Base
from sqlalchemy import Column, Integer, String, Text, DECIMAL, ForeignKey
from sqlalchemy.orm import relationship


class RoadmapStep(Base):
    __tablename__ = "roadmap_step"

    id = Column(Integer, primary_key=True)
    roadmap_id = Column(Integer, ForeignKey("roadmap.id"))
    chapter_id = Column(Integer, ForeignKey("chapters.id"))
    topic_id = Column(Integer, ForeignKey("topic.id"), nullable=True)

    step_number = Column(Integer)
    week_number = Column(Integer)
    activity_type = Column(String(50), default="learn")
    estimated_hours = Column(DECIMAL(4, 1))
    notes = Column(Text)

    roadmap = relationship("Roadmap", back_populates="steps")
    chapter = relationship("Chapter", back_populates="roadmap_steps")
    topic = relationship("Topic")
    quiz_links = relationship("RoadmapQuizMap", back_populates="roadmap_step")
