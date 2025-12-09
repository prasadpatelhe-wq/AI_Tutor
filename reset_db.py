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
    syllabus,
    language,
    language_level,
    syllabus_language_option,
    students,
    student_language_selection,
    subject,
    chapter,
    subchapter,
    quiz,
    question,
    flashcard,
    scorecard,
    student_progress,
    # grade,
    # roadmap,
    # roadmap_quiz_map,
    # roadmap_step,
    # student_progress,
    # syllabus_subject,
    # textbook,
    # topic,
)

# ------------------------------------------------------
# 4) Drop all existing tables
# ------------------------------------------------------
# ------------------------------------------------------
# 4) Drop all existing tables
# ------------------------------------------------------
print("Dropping ALL tables...")
from sqlalchemy import text

with engine.connect() as connection:
    # Disable FK checks for MySQL/MariaDB
    if "mysql" in str(engine.url):
        connection.execute(text("SET FOREIGN_KEY_CHECKS = 0;"))
    
    # For SQLite, it's usually fine, but strictly:
    if "sqlite" in str(engine.url):
        connection.execute(text("PRAGMA foreign_keys = OFF;"))

    Base.metadata.drop_all(bind=connection)

    if "mysql" in str(engine.url):
        connection.execute(text("SET FOREIGN_KEY_CHECKS = 1;"))
    if "sqlite" in str(engine.url):
        connection.execute(text("PRAGMA foreign_keys = ON;"))

# ------------------------------------------------------
# 5) Create all tables fresh
# ------------------------------------------------------
print("Creating ALL tables...")
Base.metadata.create_all(bind=engine)

print("Database reset complete!")
