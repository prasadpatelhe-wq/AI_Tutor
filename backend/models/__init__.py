# backend/models/__init__.py
from backend.database import Base

# import every model so SQLAlchemy registers them
from backend.models.board import Board
from backend.models.grade import Grade
from backend.models.subject import Subject
from backend.models.syllabus_subject import SyllabusSubject
from backend.models.textbook import Textbook
from backend.models.chapter import Chapter
from backend.models.topic import Topic
from backend.models.quiz import Quiz
from backend.models.question import Question
from backend.models.roadmap import Roadmap
from backend.models.roadmap_step import RoadmapStep
from backend.models.roadmap_quiz_map import RoadmapQuizMap
from backend.models.flashcard import Flashcard
from backend.models.students import Student
from backend.models.student_progress import StudentProgress
# add any other model files you have
