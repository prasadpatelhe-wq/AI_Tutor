import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Load .env variables
load_dotenv()

# Resolve database URL; default to a stable absolute path inside backend/
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DEFAULT_SQLITE_PATH = os.path.join(BASE_DIR, "tutor.db")
DATABASE_URL = os.getenv("DATABASE_URL") or f"sqlite:///{DEFAULT_SQLITE_PATH}"

# ✅ Create SQLAlchemy engine
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {},
)

# ✅ Create a configured session class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# ✅ Create a base class for model declarations
Base = declarative_base()

# Import models to register them with Base
# Note: We use string imports inside models to avoid circular deps, but here we import the class to register it.
# However, for Alembic/create_all to work, we just need Base to know about them.
# Importing the module is usually enough if the class inherits from Base.
from backend.models.scorecard import Scorecard
