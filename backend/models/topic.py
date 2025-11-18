from backend.database import Base
from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship


class Topic(Base):
    __tablename__ = "topic"

    id = Column(Integer, primary_key=True)
    chapter_id = Column(Integer, ForeignKey("chapters.id"))

    title = Column(String(255))
    description = Column(Text)
    order_in_chapter = Column(Integer)

    chapter = relationship("Chapter", back_populates="topics")
