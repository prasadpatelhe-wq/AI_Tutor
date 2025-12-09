from backend.database import Base
from sqlalchemy import Column, String, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
import uuid

class SyllabusLanguageOption(Base):
    __tablename__ = "syllabus_language_options"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    syllabus_id = Column(String(36), ForeignKey("syllabi.id"), nullable=False)
    level_id = Column(String(36), ForeignKey("language_levels.id"), nullable=False)
    language_id = Column(String(36), ForeignKey("languages.id"), nullable=False)

    __table_args__ = (
        UniqueConstraint('syllabus_id', 'level_id', 'language_id', name='unique_syllabus_level_language'),
    )

    syllabus = relationship("Syllabus")
    level = relationship("LanguageLevel")
    language = relationship("Language")
