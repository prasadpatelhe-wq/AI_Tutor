from backend.database import Base
from sqlalchemy import Column, String, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
import uuid

class StudentLanguageSelection(Base):
    __tablename__ = "student_language_selection"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    student_id = Column(String(36), ForeignKey("students.id"), nullable=False)
    level_id = Column(String(36), ForeignKey("language_levels.id"), nullable=False)
    language_id = Column(String(36), ForeignKey("languages.id"), nullable=False)

    __table_args__ = (
        UniqueConstraint('student_id', 'level_id', name='unique_student_level'),
    )

    student = relationship("Student")
    level = relationship("LanguageLevel")
    language = relationship("Language")
