"""
Students router - handles authentication and student management.
Uses shared utilities for security and database access.
"""

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
import json
import secrets
from datetime import datetime, timedelta

# Use shared dependencies
from backend.utils.dependencies import get_db
from backend.utils.security import (
    normalize_email,
    normalize_phone,
    compute_otp_hash,
    verify_otp_hash,
    hash_password,
    verify_password,
    password_needs_upgrade,
    generate_otp,
    get_otp_expiry,
    OTP_TTL_SECONDS,
    OTP_MAX_ATTEMPTS,
)
from backend.utils.auth import create_access_token

from backend.models.students import Student
from backend.models.otp_code import OtpCode
from backend.models.student_game_state import StudentGameState
from backend.schemas import (
    StudentRegisterRequest,
    StudentLoginRequest,
    OtpRequest,
    OtpVerifyRequest,
    StudentOtpLoginRequest,
    StudentPhoneOtpRegisterRequest,
    PasswordResetRequest,
    PasswordResetConfirmRequest,
    TokenResponse,
)

import os

router = APIRouter(prefix="/students", tags=["Students"])

# Dev mode flag for OTP echo
OTP_ECHO = os.getenv("OTP_ECHO", "").strip().lower() in {"1", "true", "yes", "y"}


def _latest_active_otp(db: Session, *, channel: str, identifier: str, purpose: str) -> OtpCode | None:
    """Get the latest active OTP for the given channel/identifier/purpose."""
    return (
        db.query(OtpCode)
        .filter(
            OtpCode.channel == channel,
            OtpCode.identifier == identifier,
            OtpCode.purpose == purpose,
            OtpCode.consumed_at.is_(None),
            OtpCode.expires_at > datetime.utcnow(),
        )
        .order_by(OtpCode.created_at.desc())
        .first()
    )


def verify_and_consume_otp(db: Session, *, channel: str, identifier: str, purpose: str, otp: str) -> None:
    """Verify OTP and mark as consumed. Raises HTTPException on failure."""
    otp_row = _latest_active_otp(db, channel=channel, identifier=identifier, purpose=purpose)
    if not otp_row:
        raise HTTPException(status_code=400, detail="OTP expired or not requested. Please request a new OTP.")

    if (otp_row.attempts or 0) >= OTP_MAX_ATTEMPTS:
        raise HTTPException(status_code=429, detail="Too many wrong attempts. Please request a new OTP.")

    if not verify_otp_hash(identifier, (otp or "").strip(), purpose, otp_row.otp_hash):
        otp_row.attempts = (otp_row.attempts or 0) + 1
        db.commit()
        raise HTTPException(status_code=400, detail="Invalid OTP. Please try again.")

    otp_row.consumed_at = datetime.utcnow()
    db.commit()


def serialize_student(student: Student) -> dict:
    """Serialize student to dict for API response."""
    preferred = None
    if student.preferred_subject_ids:
        try:
            preferred = json.loads(student.preferred_subject_ids)
        except Exception:
            preferred = None

    return {
        "id": student.id,
        "name": student.name,
        "email": student.email,
        "phone": student.phone,
        "board_id": student.board_id,
        "grade_id": student.grade_id,
        "language_id": student.language_id,
        "grade_band": student.grade_band,
        "board": student.board,
        "medium": student.medium,
        "goal": student.goal,
        "preferred_subject_ids": preferred,
        "is_active": bool(student.is_active),
    }


def _create_game_state_if_missing(db: Session, student_id: str) -> StudentGameState:
    """Create game state for student if it doesn't exist."""
    game_state = db.query(StudentGameState).filter(
        StudentGameState.student_id == student_id
    ).first()

    if not game_state:
        game_state = StudentGameState(student_id=student_id)
        db.add(game_state)
        db.commit()
        db.refresh(game_state)

    return game_state


@router.post("/register")
def register_student(req: StudentRegisterRequest, db: Session = Depends(get_db)):
    """Register a new student with email/password."""
    email = normalize_email(req.email)
    existing_student = db.query(Student).filter(Student.email == email).first()
    if existing_student:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Check phone uniqueness if provided
    phone = None
    if req.phone:
        phone = normalize_phone(req.phone)
        existing_phone = db.query(Student).filter(Student.phone == phone).first()
        if existing_phone:
            raise HTTPException(status_code=400, detail="Phone number already registered")

    new_student = Student(
        name=(req.name or "").strip() or "Student",
        email=email,
        password=hash_password(req.password),
        board_id=req.board_id,
        grade_id=req.grade_id,
        language_id=req.language_id,
        grade_band=req.grade_band,
        board=req.board,
        medium=req.medium,
        phone=phone,
        auth_provider="email_password",
        goal=req.goal,
        preferred_subject_ids=json.dumps(req.preferred_subject_ids) if req.preferred_subject_ids else None,
        is_active=True,
    )
    db.add(new_student)
    db.commit()
    db.refresh(new_student)

    # Create game state for the student
    _create_game_state_if_missing(db, new_student.id)

    # Generate access token
    access_token = create_access_token(new_student.id)

    return {
        "message": "Registration successful",
        "student": serialize_student(new_student),
        "access_token": access_token,
        "token_type": "bearer",
    }


@router.post("/login")
def login_student(req: StudentLoginRequest, db: Session = Depends(get_db)):
    """Login with email/password."""
    student = db.query(Student).filter(Student.email == normalize_email(req.email)).first()

    if not student:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not student.password:
        raise HTTPException(status_code=401, detail="Account setup incomplete. Please use OTP login or contact support.")

    if not verify_password(req.password, student.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not student.is_active:
        raise HTTPException(status_code=403, detail="Account is inactive. Please contact administrator.")

    # Upgrade legacy SHA-256 hash to bcrypt if needed
    if password_needs_upgrade(student.password):
        student.password = hash_password(req.password)
        db.commit()

    # Ensure game state exists
    _create_game_state_if_missing(db, student.id)

    # Generate access token
    access_token = create_access_token(student.id)

    return {
        "message": "Login successful",
        "student": serialize_student(student),
        "access_token": access_token,
        "token_type": "bearer",
    }


@router.get("/{student_id}")
def get_student(student_id: str, db: Session = Depends(get_db)):
    """Get student by ID."""
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return {"student": serialize_student(student)}


@router.post("/otp/request")
def request_otp(req: OtpRequest, db: Session = Depends(get_db)):
    """Request OTP for login, registration, or password reset."""
    channel = req.channel
    purpose = req.purpose

    if channel == "email":
        identifier = normalize_email(req.identifier)
        student = db.query(Student).filter(Student.email == identifier).first()
    else:
        identifier = normalize_phone(req.identifier)
        student = db.query(Student).filter(Student.phone == identifier).first()

    # Validate based on purpose
    if purpose == "register" and student:
        raise HTTPException(status_code=409, detail="Account already exists. Please log in.")
    if purpose in {"login", "password_reset"} and not student:
        # Use generic error message to prevent user enumeration
        raise HTTPException(status_code=400, detail="Unable to send OTP. Please check your input.")

    code = generate_otp()
    record = OtpCode(
        channel=channel,
        identifier=identifier,
        purpose=purpose,
        otp_hash=compute_otp_hash(identifier, code, purpose),
        expires_at=get_otp_expiry(),
        attempts=0,
    )
    db.add(record)
    db.commit()

    # Log OTP for development
    print(f"[OTP] purpose={purpose} channel={channel} identifier={identifier} otp={code}")

    response = {"success": True, "message": "OTP sent"}
    if OTP_ECHO:
        response["dev_otp"] = code
    return response


@router.post("/otp/verify")
def verify_otp(req: OtpVerifyRequest, db: Session = Depends(get_db)):
    """Verify OTP without consuming it (for multi-step flows)."""
    channel = req.channel
    purpose = req.purpose
    identifier = normalize_email(req.identifier) if channel == "email" else normalize_phone(req.identifier)
    verify_and_consume_otp(db, channel=channel, identifier=identifier, purpose=purpose, otp=req.otp)
    return {"success": True}


@router.post("/login_otp")
def login_student_otp(req: StudentOtpLoginRequest, db: Session = Depends(get_db)):
    """Login with phone OTP."""
    phone = normalize_phone(req.phone)
    verify_and_consume_otp(db, channel="phone", identifier=phone, purpose="login", otp=req.otp)

    student = db.query(Student).filter(Student.phone == phone).first()
    if not student:
        raise HTTPException(status_code=401, detail="No account found for this phone. Please create an account.")

    if not student.is_active:
        raise HTTPException(status_code=403, detail="Account is inactive. Please contact administrator.")

    # Ensure game state exists
    _create_game_state_if_missing(db, student.id)

    # Generate access token
    access_token = create_access_token(student.id)

    return {
        "message": "Login successful",
        "student": serialize_student(student),
        "access_token": access_token,
        "token_type": "bearer",
    }


@router.post("/register_otp")
def register_student_otp(req: StudentPhoneOtpRegisterRequest, db: Session = Depends(get_db)):
    """Register with phone OTP."""
    phone = normalize_phone(req.phone)
    verify_and_consume_otp(db, channel="phone", identifier=phone, purpose="register", otp=req.otp)

    existing = db.query(Student).filter(Student.phone == phone).first()
    if existing:
        raise HTTPException(status_code=409, detail="Account already exists. Please log in.")

    import re
    digits = re.sub(r"\D", "", phone)
    placeholder_email = f"phone_{digits}@ai-tutor.local"

    new_student = Student(
        name=(req.name or "").strip() or "Student",
        email=placeholder_email,
        password=None,
        phone=phone,
        auth_provider="phone_otp",
        board_id=req.board_id,
        grade_id=req.grade_id,
        language_id=req.language_id,
        grade_band=req.grade_band,
        board=req.board,
        medium=req.medium,
        goal=req.goal,
        preferred_subject_ids=json.dumps(req.preferred_subject_ids) if req.preferred_subject_ids else None,
        is_active=True,
    )
    db.add(new_student)
    db.commit()
    db.refresh(new_student)

    # Create game state
    _create_game_state_if_missing(db, new_student.id)

    # Generate access token
    access_token = create_access_token(new_student.id)

    return {
        "message": "Registration successful",
        "student": serialize_student(new_student),
        "access_token": access_token,
        "token_type": "bearer",
    }


@router.post("/password_reset/request")
def request_password_reset(req: PasswordResetRequest, db: Session = Depends(get_db)):
    """Request password reset OTP."""
    email = normalize_email(req.email)
    student = db.query(Student).filter(Student.email == email).first()

    # Always return success to prevent user enumeration
    code = generate_otp()

    if student:
        record = OtpCode(
            channel="email",
            identifier=email,
            purpose="password_reset",
            otp_hash=compute_otp_hash(email, code, "password_reset"),
            expires_at=get_otp_expiry(),
            attempts=0,
        )
        db.add(record)
        db.commit()
        print(f"[OTP] purpose=password_reset channel=email identifier={email} otp={code}")

    response = {"success": True, "message": "If an account exists, a password reset OTP has been sent"}
    if OTP_ECHO and student:
        response["dev_otp"] = code
    return response


@router.post("/password_reset/confirm")
def confirm_password_reset(req: PasswordResetConfirmRequest, db: Session = Depends(get_db)):
    """Confirm password reset with OTP."""
    email = normalize_email(req.email)
    verify_and_consume_otp(db, channel="email", identifier=email, purpose="password_reset", otp=req.otp)

    student = db.query(Student).filter(Student.email == email).first()
    if not student:
        raise HTTPException(status_code=404, detail="Account not found")

    # Validate new password length
    if len(req.new_password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")

    student.password = hash_password(req.new_password)
    student.auth_provider = "email_password"
    db.commit()

    return {"success": True, "message": "Password updated successfully"}


@router.post("/{student_id}/toggle_active")
def toggle_student_active(student_id: str, db: Session = Depends(get_db)):
    """Toggle student active status (admin function)."""
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    # Toggle status
    student.is_active = not student.is_active
    db.commit()

    status_str = "active" if student.is_active else "inactive"
    return {"message": f"Student is now {status_str}", "is_active": student.is_active}
