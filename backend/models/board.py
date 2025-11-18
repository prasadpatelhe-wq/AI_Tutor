from backend.database import Base
from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.orm import relationship


class Board(Base):
    __tablename__ = "boards"

    id = Column(Integer, primary_key=True)
    code = Column(String(50))
    name = Column(String(100))
    description = Column(Text)

    syllabus_subjects = relationship("SyllabusSubject", back_populates="board")
