# reset_db.py
"""
Run this script to DROP and CREATE all database tables.

Usage:
    python reset_db.py
"""

import os
import sys

# ------------------------------------------------------
# 1) Add project ROOT directory to sys.path
# ------------------------------------------------------
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(ROOT_DIR)

# ------------------------------------------------------
# 2) Import DB engine and Base
# ------------------------------------------------------
from backend.database import Base, engine

# ------------------------------------------------------
# 3) Import ALL models so SQLAlchemy registers them
#    IMPORTANT: Missing even ONE model causes FK errors
# ------------------------------------------------------
from backend.models import (
    board,
    chapter,
    flashcard,
    grade,
    question,
    quiz,
    roadmap,
    roadmap_quiz_map,
    roadmap_step,
    student_progress,
    students,
    subject,
    syllabus_subject,
    textbook,
    topic,
)

# ------------------------------------------------------
# 4) Drop all existing tables
# ------------------------------------------------------
print("⚠️  Dropping ALL tables...")
Base.metadata.drop_all(bind=engine)

# ------------------------------------------------------
# 5) Create all tables fresh
# ------------------------------------------------------
print("🛠  Creating ALL tables...")
Base.metadata.create_all(bind=engine)

print("✅  Database reset complete!")
