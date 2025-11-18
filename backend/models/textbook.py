from backend.database import Base
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship


class Textbook(Base):
    __tablename__ = "textbook"

    id = Column(Integer, primary_key=True)
    syllabus_subject_id = Column(Integer, ForeignKey("syllabus_subject.id"), nullable=False)

    title = Column(String(255))
    publisher = Column(String(255))
    edition = Column(String(50))
    language = Column(String(50))
    year_published = Column(Integer)
    is_default = Column(Boolean, default=False)

    syllabus_subject = relationship("SyllabusSubject", back_populates="textbooks")
    chapters = relationship("Chapter", back_populates="textbook")
    roadmaps = relationship("Roadmap", back_populates="textbook")
