from backend.database import Base
from sqlalchemy import Column, Integer, String


class Grade(Base):
    __tablename__ = "grades"

    id = Column(Integer, primary_key=True)
    grade_name = Column(String(50))
    display_name = Column(String(50))
