from pydantic import BaseModel
from typing import List


# Pydantic models for requests
class ParentPinRequest(BaseModel):
    pin: str

class VideoRequest(BaseModel):
    subject: str

class QuizRequest(BaseModel):
    subject: str
    grade_band: str
    chapter_id: str
    chapter_title: str
    chapter_summary: str
    subchapter_id: str | None = None
    subchapter_title: str | None = None
    subchapter_summary: str | None = None
    num_questions: int = 5
    difficulty: str = "basic"

class FlashcardFetchRequest(BaseModel):
    subject: str
    chapter: str

class QuizScoreRequest(BaseModel):
    answers: list[int]
    correct_answers: list[int]

class PerkBuyRequest(BaseModel):
    perk_index: int

class RoadmapRequest(BaseModel):
    grade: str
    board: str
    subject: str

class ChatRequest(BaseModel):
    message: str
    subject: str
    grade: str

class ProgressRequest(BaseModel):
    student_id: int
    flashcard_id: int
    correct: bool

class StudentRegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    grade_band: str
    board: str = "CBSE"  # Default to CBSE if not provided
    medium: str | None = None  # Language/medium of instruction

class StudentLoginRequest(BaseModel):
    email: str
    password: str

