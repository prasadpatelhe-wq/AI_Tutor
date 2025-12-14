from backend.database import Base
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

class Student(Base):
    __tablename__ = "students"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), nullable=False)
    email = Column(String(200), unique=True, nullable=False)
    password = Column(String(200))  # Keeping password for auth

    # New FK references (preferred)
    board_id = Column(String(36), ForeignKey("boards.id"), nullable=True)
    grade_id = Column(String(36), ForeignKey("grades.id"), nullable=True)
    language_id = Column(String(36), ForeignKey("languages.id"), nullable=True)

    # Legacy string columns (kept for backward compatibility during migration)
    grade_band = Column(String(20))
    board = Column(String(50))
    medium = Column(String(50))

    is_active = Column(Integer, default=1)
    phone = Column(String(20))
    auth_provider = Column(String(20))  # "email_password" | "phone_otp"
    goal = Column(String(50))  # "Exam marks" | "Concept clarity" | "Revision"
    preferred_subject_ids = Column(Text)  # JSON-encoded list of subject IDs
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    board_ref = relationship("Board", foreign_keys=[board_id])
    grade_ref = relationship("Grade", foreign_keys=[grade_id])
    language_ref = relationship("Language", foreign_keys=[language_id])
