from backend.database import Base
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship


class SyllabusSubject(Base):
    __tablename__ = "syllabus_subject"

    id = Column(Integer, primary_key=True)
    board_id = Column(Integer, ForeignKey("boards.id"))
    grade_id = Column(Integer, ForeignKey("grades.id"))
    subject_id = Column(Integer, ForeignKey("subjects.id"))
    academic_year = Column(String(10))
    is_active = Column(Boolean, default=True)

    __table_args__ = (
        UniqueConstraint("board_id", "grade_id", "subject_id", "academic_year"),
    )

    board = relationship("Board", back_populates="syllabus_subjects")
    grade = relationship("Grade", back_populates="syllabus_subjects")
    subject = relationship("Subject", back_populates="syllabus_subjects")

    textbooks = relationship("Textbook", back_populates="syllabus_subject")
    roadmaps = relationship("Roadmap", back_populates="syllabus_subject")
