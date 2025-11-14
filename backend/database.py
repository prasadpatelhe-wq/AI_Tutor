# backend/database.py

import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Load .env variables
load_dotenv()

# ✅ Get database URL from .env file
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("❌ DATABASE_URL not found in .env file")

# ✅ Create SQLAlchemy engine
engine = create_engine(DATABASE_URL, echo=True)

# ✅ Create a configured session class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# ✅ Create a base class for model declarations
Base = declarative_base()
