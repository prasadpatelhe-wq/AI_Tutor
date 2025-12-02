"""Centralized Pydantic request/response schemas for the backend API."""
from typing import List, Optional

from pydantic import BaseModel


class ParentPinRequest(BaseModel):
    pin: str


class VideoRequest(BaseModel):
    subject: str


class QuizRequest(BaseModel):
    subject: str
    grade_band: str
    chapter_id: str | int
    chapter_title: str
    chapter_summary: str
    num_questions: int = 5
    difficulty: str = "basic"


class FlashcardFetchRequest(BaseModel):
    subject: str
    chapter: str


class QuizScoreRequest(BaseModel):
    answers: List[int]
    correct_answers: List[int]
    difficulty: str = "basic"
    chapter_id: Optional[int] = None
    subject_id: Optional[int] = None
    student_id: Optional[int] = None


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
    board: str = "CBSE"


class StudentLoginRequest(BaseModel):
    email: str
    password: str
