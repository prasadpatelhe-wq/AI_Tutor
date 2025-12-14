from pydantic import BaseModel
from typing import Literal


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
    name: str | None = None
    email: str
    password: str
    phone: str | None = None
    consent: bool | None = True
    # FK-based references (preferred)
    board_id: str | None = None
    grade_id: str | None = None
    language_id: str | None = None
    # Legacy string fields (for backward compatibility)
    grade_band: str | None = None
    board: str | None = None
    medium: str | None = None
    # Optional onboarding preferences
    goal: str | None = None
    preferred_subject_ids: list[str] | None = None

class StudentLoginRequest(BaseModel):
    email: str
    password: str


class OtpRequest(BaseModel):
    channel: Literal["phone", "email"]
    identifier: str
    purpose: Literal["login", "register", "password_reset", "parent"]


class OtpVerifyRequest(BaseModel):
    channel: Literal["phone", "email"]
    identifier: str
    purpose: Literal["login", "register", "password_reset", "parent"]
    otp: str


class StudentOtpLoginRequest(BaseModel):
    phone: str
    otp: str


class StudentPhoneOtpRegisterRequest(BaseModel):
    phone: str
    otp: str
    consent: bool | None = True
    name: str | None = None
    # FK-based references (preferred)
    board_id: str | None = None
    grade_id: str | None = None
    language_id: str | None = None
    # Legacy string fields (for backward compatibility)
    grade_band: str | None = None
    board: str | None = None
    medium: str | None = None
    # Optional onboarding preferences
    goal: str | None = None
    preferred_subject_ids: list[str] | None = None


class PasswordResetRequest(BaseModel):
    email: str


class PasswordResetConfirmRequest(BaseModel):
    email: str
    otp: str
    new_password: str
