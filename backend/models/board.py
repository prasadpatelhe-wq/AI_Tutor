"""
Board model for educational boards (CBSE, ICSE, etc.).
"""

from backend.database import Base
from sqlalchemy import Column, String, Text
import uuid


class Board(Base):
    __tablename__ = "boards"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), nullable=False, unique=True, index=True)
    description = Column(Text)
