from backend.database import Base
from sqlalchemy import Column, String, Text, Integer, ForeignKey
from sqlalchemy.orm import relationship
import uuid

class Subchapter(Base):
    __tablename__ = "subchapters"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    chapter_id = Column(String(36), ForeignKey("chapters.id"), nullable=False)
    subchapter_no = Column(Text)
    title = Column(Text, nullable=False)
    description = Column(Text)
    order_index = Column(Integer)

    chapter = relationship("Chapter", back_populates="subchapters")
