from backend.database import Base
from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.orm import relationship
import uuid

class Subject(Base):
    __tablename__ = "subjects"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    syllabus_id = Column(String(36), ForeignKey("syllabi.id"), nullable=False)
    name = Column(String(100), nullable=False)
    code = Column(String(50))
    order_index = Column(Integer, default=0)

    syllabus = relationship("Syllabus")
    chapters = relationship("Chapter", back_populates="subject")
