from backend.database import Base
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship


class Subject(Base):
    __tablename__ = "subjects"

    id = Column(Integer, primary_key=True)
    code = Column(String(50))
    name = Column(String(100))

    chapters = relationship("Chapter", back_populates="subject")
    syllabus_subjects = relationship("SyllabusSubject", back_populates="subject")
