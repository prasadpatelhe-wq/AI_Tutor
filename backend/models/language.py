from backend.database import Base
from sqlalchemy import Column, String, Text
import uuid

class Language(Base):
    __tablename__ = "languages"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    code = Column(String(10), unique=True)
    name = Column(Text, nullable=False)
    script = Column(Text)
    direction = Column(Text, default='ltr')
