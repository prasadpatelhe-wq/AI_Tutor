"""
Pydantic schemas for request/response validation.
Centralized location for all API models - do not duplicate in other files.
"""

from pydantic import BaseModel, Field, field_validator
from typing import Literal, Optional, List
from datetime import datetime
import re


# ============================================================
# AUTHENTICATION SCHEMAS
# ============================================================

class ParentPinRequest(BaseModel):
    pin: str


class OtpRequest(BaseModel):
    channel: Literal["phone", "email"]
    identifier: str
    purpose: Literal["login", "register", "password_reset", "parent"]


class OtpVerifyRequest(BaseModel):
    channel: Literal["phone", "email"]
    identifier: str
    purpose: Literal["login", "register", "password_reset", "parent"]
    otp: str


class StudentLoginRequest(BaseModel):
    email: str
    password: str


class StudentOtpLoginRequest(BaseModel):
    phone: str
    otp: str


class PasswordResetRequest(BaseModel):
    email: str


class PasswordResetConfirmRequest(BaseModel):
    email: str
    otp: str
    new_password: str


# ============================================================
# STUDENT REGISTRATION SCHEMAS
# ============================================================

class StudentRegisterRequest(BaseModel):
    name: Optional[str] = None
    email: str
    password: str = Field(..., min_length=6)
    phone: Optional[str] = None
    consent: Optional[bool] = True
    # FK-based references (preferred)
    board_id: Optional[str] = None
    grade_id: Optional[str] = None
    language_id: Optional[str] = None
    # Legacy string fields (for backward compatibility)
    grade_band: Optional[str] = None
    board: Optional[str] = None
    medium: Optional[str] = None
    # Optional onboarding preferences
    goal: Optional[str] = None
    preferred_subject_ids: Optional[List[str]] = None

    @field_validator('email')
    @classmethod
    def validate_email(cls, v):
        if not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', v):
            raise ValueError('Invalid email format')
        return v.lower().strip()


class StudentPhoneOtpRegisterRequest(BaseModel):
    phone: str
    otp: str
    consent: Optional[bool] = True
    name: Optional[str] = None
    # FK-based references (preferred)
    board_id: Optional[str] = None
    grade_id: Optional[str] = None
    language_id: Optional[str] = None
    # Legacy string fields (for backward compatibility)
    grade_band: Optional[str] = None
    board: Optional[str] = None
    medium: Optional[str] = None
    # Optional onboarding preferences
    goal: Optional[str] = None
    preferred_subject_ids: Optional[List[str]] = None


# ============================================================
# QUIZ SCHEMAS
# ============================================================

class QuizRequest(BaseModel):
    subject: str
    grade_band: str
    chapter_id: str
    chapter_title: str
    chapter_summary: str
    subchapter_id: Optional[str] = None
    subchapter_title: Optional[str] = None
    subchapter_summary: Optional[str] = None
    num_questions: int = Field(default=5, ge=1, le=20)
    difficulty: str = "basic"
    student_id: Optional[str] = None  # Added for proper student tracking


class QuizScoreRequest(BaseModel):
    answers: List[int]
    correct_answers: List[int]
    student_id: Optional[str] = None  # Track which student
    quiz_id: Optional[str] = None  # Track which quiz
    subject_id: Optional[str] = None
    chapter_id: Optional[str] = None
    difficulty: Optional[str] = None


# ============================================================
# FLASHCARD SCHEMAS
# ============================================================

class FlashcardFetchRequest(BaseModel):
    subject: str
    chapter: str
    student_id: Optional[str] = None


class ProgressRequest(BaseModel):
    student_id: str  # Changed to str for UUID consistency
    flashcard_id: str  # Changed to str for UUID consistency
    correct: bool


# ============================================================
# GAMIFICATION SCHEMAS
# ============================================================

class PerkBuyRequest(BaseModel):
    perk_index: int
    student_id: Optional[str] = None


class CoinAwardRequest(BaseModel):
    student_id: str
    amount: int
    reason: Optional[str] = None


# ============================================================
# CONTENT SCHEMAS
# ============================================================

class VideoRequest(BaseModel):
    subject: str


class RoadmapRequest(BaseModel):
    grade: str
    board: str
    subject: str


class ChatRequest(BaseModel):
    message: str
    subject: str
    grade: str


# ============================================================
# RESPONSE SCHEMAS
# ============================================================

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    student_id: str


class StudentResponse(BaseModel):
    id: str
    name: Optional[str]
    email: str
    phone: Optional[str]
    board_id: Optional[str]
    grade_id: Optional[str]
    language_id: Optional[str]
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class GameStateResponse(BaseModel):
    coins: int
    current_streak: int
    longest_streak: int
    daily_progress: dict
    purchased_perks: List[str]
    total_quizzes_completed: int
    total_flashcards_reviewed: int


class QuizResponse(BaseModel):
    quiz_id: str
    chapter_id: str
    grade_band: str
    difficulty: str
    questions: List[dict]


class ScoreResponse(BaseModel):
    score: int
    total: int
    percentage: float
    coins_earned: int
    message: str


class FlashcardResponse(BaseModel):
    id: str
    question_text: str
    explanation: Optional[str]
    difficulty: Optional[str]
    created_at: datetime


class HealthResponse(BaseModel):
    status: str
    timestamp: datetime


class ErrorResponse(BaseModel):
    detail: str
    error_code: Optional[str] = None
