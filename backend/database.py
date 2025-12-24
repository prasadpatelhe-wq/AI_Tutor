"""
Database configuration with proper connection pooling and session management.
Supports SQLite (development) and PostgreSQL/MySQL (production).
"""

import os
import pathlib
import logging
from contextlib import contextmanager
from typing import Generator

from dotenv import load_dotenv
from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker, Session, declarative_base
from sqlalchemy.pool import QueuePool, StaticPool

# Load environment variables
load_dotenv()

logger = logging.getLogger(__name__)

# Database URL configuration
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    # Fallback for local development - use SQLite
    DB_DIR = pathlib.Path(__file__).parent.resolve()
    DATABASE_URL = f"sqlite:///{DB_DIR}/tutor.db"
    logger.info(f"Using SQLite database at: {DB_DIR}/tutor.db")


def _get_engine_kwargs() -> dict:
    """
    Returns appropriate engine configuration based on database type.
    SQLite uses StaticPool (single connection), PostgreSQL/MySQL use QueuePool.
    """
    if "sqlite" in DATABASE_URL:
        return {
            "connect_args": {"check_same_thread": False},
            "poolclass": StaticPool,
            "echo": os.getenv("SQL_ECHO", "false").lower() == "true",
        }
    else:
        # PostgreSQL/MySQL configuration with connection pooling
        return {
            "poolclass": QueuePool,
            "pool_size": int(os.getenv("DB_POOL_SIZE", "5")),
            "max_overflow": int(os.getenv("DB_MAX_OVERFLOW", "10")),
            "pool_recycle": int(os.getenv("DB_POOL_RECYCLE", "3600")),
            "pool_pre_ping": True,  # Verify connections before use
            "echo": os.getenv("SQL_ECHO", "false").lower() == "true",
        }


# Create SQLAlchemy engine with appropriate settings
engine = create_engine(DATABASE_URL, **_get_engine_kwargs())

# Enable SQLite foreign key support
if "sqlite" in DATABASE_URL:
    @event.listens_for(engine, "connect")
    def set_sqlite_pragma(dbapi_connection, connection_record):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()


# Session factory - autocommit=False, autoflush=False for explicit transaction control
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    expire_on_commit=False,  # Prevent lazy loading issues after commit
)

# Base class for all ORM models
Base = declarative_base()


def get_db() -> Generator[Session, None, None]:
    """
    FastAPI dependency for database sessions.
    Usage: db: Session = Depends(get_db)

    Yields a session and ensures cleanup on exit.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@contextmanager
def get_db_context() -> Generator[Session, None, None]:
    """
    Context manager for database sessions (for non-FastAPI code).
    Usage: with get_db_context() as db: ...

    Automatically commits on success, rollback on exception.
    """
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


def init_db() -> None:
    """
    Initialize database tables.
    Should be called at application startup after all models are imported.
    """
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables initialized")


def check_db_connection() -> bool:
    """
    Health check for database connection.
    Returns True if connection is successful.
    """
    try:
        with engine.connect() as conn:
            conn.execute("SELECT 1" if "sqlite" not in DATABASE_URL else "SELECT 1")
        return True
    except Exception as e:
        logger.error(f"Database connection failed: {e}")
        return False
