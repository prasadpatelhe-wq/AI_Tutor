from backend.database import Base
from sqlalchemy import Column, String, Text, Integer, Boolean, ForeignKey
from sqlalchemy.orm import relationship
import uuid

class Syllabus(Base):
    __tablename__ = "syllabi"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    board_id = Column(String(36), ForeignKey("boards.id"), nullable=False)
    class_grade = Column("class", Integer, nullable=False) # 'class' is a reserved keyword in Python
    subject = Column(Text, nullable=False)
    academic_year = Column(Text)
    syllabus_version = Column(Text)
    is_active = Column(Boolean, default=True)

    board = relationship("Board")
