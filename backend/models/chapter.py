from sqlalchemy import Column, Integer, String, Text, ForeignKey
from backend.database import Base

class Chapter(Base):
    __tablename__ = "chapters"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(150), nullable=False)
    summary = Column(Text)
    subject_id = Column(Integer, ForeignKey("subjects.id"))
