from backend.database import Base
from sqlalchemy import Column, String, Text, Integer
import uuid

class LanguageLevel(Base):
    __tablename__ = "language_levels"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    level_name = Column(Text, nullable=False)
    level_order = Column(Integer, nullable=False)
