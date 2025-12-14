"""
Shared dependencies for FastAPI routes.
All routers should import from here instead of defining their own.
"""

from typing import Generator
from sqlalchemy.orm import Session
from backend.database import SessionLocal


def get_db() -> Generator[Session, None, None]:
    """
    Dependency that provides a database session.
    Use with FastAPI's Depends(): db: Session = Depends(get_db)
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
