# backend/models/__init__.py
from backend.database import Base

# import every model so SQLAlchemy registers them
from backend.models.board import Board
from backend.models.syllabus import Syllabus
from backend.models.language import Language
from backend.models.language_level import LanguageLevel
from backend.models.syllabus_language_option import SyllabusLanguageOption
from backend.models.students import Student
from backend.models.student_language_selection import StudentLanguageSelection
from backend.models.subject import Subject
from backend.models.chapter import Chapter
from backend.models.subchapter import Subchapter
from backend.models.quiz import Quiz
from backend.models.question import Question
from backend.models.flashcard import Flashcard
from backend.models.scorecard import Scorecard
from backend.models.student_progress import StudentProgress
from backend.models.otp_code import OtpCode

# Obsolete models (commented out)
# from backend.models.grade import Grade
# from backend.models.syllabus_subject import SyllabusSubject
# from backend.models.textbook import Textbook
# from backend.models.topic import Topic
# from backend.models.roadmap import Roadmap
# from backend.models.roadmap_step import RoadmapStep
# from backend.models.roadmap_quiz_map import RoadmapQuizMap
# from backend.models.student_progress import StudentProgress
