# backend/models/__init__.py
"""
SQLAlchemy model registration.
All models must be imported here for SQLAlchemy to know about them.
"""

from backend.database import Base

# Core metadata models
from backend.models.board import Board
from backend.models.grade import Grade
from backend.models.syllabus import Syllabus
from backend.models.language import Language
from backend.models.language_level import LanguageLevel
from backend.models.syllabus_language_option import SyllabusLanguageOption

# Student and authentication
from backend.models.students import Student
from backend.models.student_language_selection import StudentLanguageSelection
from backend.models.otp_code import OtpCode

# Curriculum content
from backend.models.subject import Subject
from backend.models.chapter import Chapter
from backend.models.subchapter import Subchapter

# Learning and assessment
from backend.models.quiz import Quiz
from backend.models.question import Question
from backend.models.flashcard import Flashcard
from backend.models.scorecard import Scorecard
from backend.models.student_progress import StudentProgress

# Gamification
from backend.models.student_game_state import StudentGameState

# Export all models for easy importing
__all__ = [
    'Base',
    'Board',
    'Grade',
    'Syllabus',
    'Language',
    'LanguageLevel',
    'SyllabusLanguageOption',
    'Student',
    'StudentLanguageSelection',
    'OtpCode',
    'Subject',
    'Chapter',
    'Subchapter',
    'Quiz',
    'Question',
    'Flashcard',
    'Scorecard',
    'StudentProgress',
    'StudentGameState',
]
