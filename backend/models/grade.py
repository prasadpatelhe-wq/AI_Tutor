"""
Grade model for grade levels.
Using String(36) UUID for consistency with other models.
"""

from backend.database import Base
from sqlalchemy import Column, String
import uuid


class Grade(Base):
    __tablename__ = "grades"

    # Changed from Integer to String(36) for consistency
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    grade_name = Column(String(50), nullable=False, unique=True, index=True)
    display_name = Column(String(50), nullable=False)
