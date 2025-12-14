from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from backend.database import SessionLocal
from backend.models.students import Student
from backend.models.otp_code import OtpCode
from backend.schemas import (
    StudentRegisterRequest,
    StudentLoginRequest,
    OtpRequest,
    OtpVerifyRequest,
    StudentOtpLoginRequest,
    StudentPhoneOtpRegisterRequest,
    PasswordResetRequest,
    PasswordResetConfirmRequest,
)
import hashlib
import bcrypt
import hmac
import json
import os
import re
import secrets
from datetime import datetime, timedelta

router = APIRouter(prefix="/students", tags=["Students"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(password: str, stored_hash: str) -> bool:
    """
    Prefer bcrypt, but support legacy SHA-256 hashes for existing users.
    """
    if not stored_hash:
        return False

    try:
        # bcrypt hashes are 60 chars and contain salt
        return bcrypt.checkpw(password.encode(), stored_hash.encode())
    except ValueError:
        # If stored_hash is not a valid bcrypt hash, fall back to SHA-256
        return hashlib.sha256(password.encode()).hexdigest() == stored_hash

OTP_SECRET = os.getenv("OTP_SECRET", "dev-insecure-otp-secret")
OTP_TTL_MINUTES = int(os.getenv("OTP_TTL_MINUTES", "10"))
OTP_MAX_ATTEMPTS = int(os.getenv("OTP_MAX_ATTEMPTS", "5"))
OTP_ECHO = os.getenv("OTP_ECHO", "").strip().lower() in {"1", "true", "yes", "y"}


def normalize_email(email: str) -> str:
    return email.strip().lower()


def normalize_phone(phone: str) -> str:
    raw = (phone or "").strip()
    digits = re.sub(r"\D", "", raw)
    if not digits:
        raise HTTPException(status_code=400, detail="Invalid phone number")
    # India-first: assume 10-digit numbers are Indian and prefix +91.
    if len(digits) == 10:
        return f"+91{digits}"
    # If already includes country code, keep it.
    return f"+{digits}"


def compute_otp_hash(code: str, identifier: str, purpose: str) -> str:
    msg = f"{purpose}:{identifier}:{code}".encode()
    return hmac.new(OTP_SECRET.encode(), msg, hashlib.sha256).hexdigest()


def _latest_active_otp(db: Session, *, channel: str, identifier: str, purpose: str) -> OtpCode | None:
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
    otp_row = _latest_active_otp(db, channel=channel, identifier=identifier, purpose=purpose)
    if not otp_row:
        raise HTTPException(status_code=400, detail="OTP expired or not requested. Please request a new OTP.")

    if (otp_row.attempts or 0) >= OTP_MAX_ATTEMPTS:
        raise HTTPException(status_code=429, detail="Too many wrong attempts. Please request a new OTP.")

    expected = compute_otp_hash((otp or "").strip(), identifier, purpose)
    if not hmac.compare_digest(expected, otp_row.otp_hash):
        otp_row.attempts = (otp_row.attempts or 0) + 1
        db.commit()
        raise HTTPException(status_code=400, detail="Invalid OTP. Please try again.")

    otp_row.consumed_at = datetime.utcnow()
    db.commit()


def serialize_student(student: Student) -> dict:
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
        "grade_band": student.grade_band,
        "board": student.board,
        "medium": student.medium,
        "goal": student.goal,
        "preferred_subject_ids": preferred,
    }


@router.post("/register")
def register_student(req: StudentRegisterRequest, db: Session = Depends(get_db)):
    # Check if email already exists
    email = normalize_email(req.email)
    existing_student = db.query(Student).filter(Student.email == email).first()
    if existing_student:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_student = Student(
        name=(req.name or "").strip() or "Student",
        email=email,
        password=hash_password(req.password),
        # New FK-based references
        board_id=req.board_id,
        grade_id=req.grade_id,
        language_id=req.language_id,
        # Legacy string fields (for backward compatibility)
        grade_band=req.grade_band,
        board=req.board,
        medium=req.medium,
        phone=normalize_phone(req.phone) if req.phone else None,
        auth_provider="email_password",
        goal=req.goal,
        preferred_subject_ids=json.dumps(req.preferred_subject_ids) if req.preferred_subject_ids else None,
        is_active=1,  # Default to active
    )
    db.add(new_student)
    db.commit()
    db.refresh(new_student)
    
    return {
        "message": "Registration successful",
        "student": serialize_student(new_student),
    }

@router.post("/login")
def login_student(req: StudentLoginRequest, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.email == normalize_email(req.email)).first()
    
    if not student:
        raise HTTPException(status_code=401, detail="Invalid email or password")
        
    if not student.password:
        # Handle legacy students with no password (optional: allow them to set one, or fail)
        # For now, fail if no password set
        raise HTTPException(status_code=401, detail="Account setup incomplete. Please contact support.")

    if not verify_password(req.password, student.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
        
    if not student.is_active:
        raise HTTPException(status_code=403, detail="Account is inactive. Please contact administrator.")

    # If user was on legacy SHA-256 hash (64 hex chars), upgrade to bcrypt transparently
    if len(student.password) == 64:
        student.password = hash_password(req.password)
        db.commit()
        db.refresh(student)
        
    return {
        "message": "Login successful",
        "student": serialize_student(student),
    }


@router.get("/{student_id}")
def get_student(student_id: str, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return {"student": serialize_student(student)}


@router.post("/otp/request")
def request_otp(req: OtpRequest, db: Session = Depends(get_db)):
    channel = req.channel
    purpose = req.purpose

    if channel == "email":
        identifier = normalize_email(req.identifier)
        student = db.query(Student).filter(Student.email == identifier).first()
    else:
        identifier = normalize_phone(req.identifier)
        student = db.query(Student).filter(Student.phone == identifier).first()

    if purpose == "register" and student:
        raise HTTPException(status_code=409, detail="Account already exists. Please log in.")
    if purpose in {"login", "password_reset"} and not student:
        raise HTTPException(status_code=404, detail="No account found. Please create an account first.")

    code = f"{secrets.randbelow(1_000_000):06d}"
    record = OtpCode(
        channel=channel,
        identifier=identifier,
        purpose=purpose,
        otp_hash=compute_otp_hash(code, identifier, purpose),
        expires_at=datetime.utcnow() + timedelta(minutes=OTP_TTL_MINUTES),
        attempts=0,
    )
    db.add(record)
    db.commit()

    # Dev convenience: print OTP to server logs.
    print(f"[OTP] purpose={purpose} channel={channel} identifier={identifier} otp={code}")

    response = {"success": True, "message": "OTP sent"}
    if OTP_ECHO:
        response["dev_otp"] = code
    return response


@router.post("/otp/verify")
def verify_otp(req: OtpVerifyRequest, db: Session = Depends(get_db)):
    channel = req.channel
    purpose = req.purpose
    identifier = normalize_email(req.identifier) if channel == "email" else normalize_phone(req.identifier)
    verify_and_consume_otp(db, channel=channel, identifier=identifier, purpose=purpose, otp=req.otp)
    return {"success": True}


@router.post("/login_otp")
def login_student_otp(req: StudentOtpLoginRequest, db: Session = Depends(get_db)):
    phone = normalize_phone(req.phone)
    verify_and_consume_otp(db, channel="phone", identifier=phone, purpose="login", otp=req.otp)

    student = db.query(Student).filter(Student.phone == phone).first()
    if not student:
        raise HTTPException(status_code=401, detail="No account found for this phone. Please create an account.")

    if not student.is_active:
        raise HTTPException(status_code=403, detail="Account is inactive. Please contact administrator.")

    return {
        "message": "Login successful",
        "student": serialize_student(student),
    }


@router.post("/register_otp")
def register_student_otp(req: StudentPhoneOtpRegisterRequest, db: Session = Depends(get_db)):
    phone = normalize_phone(req.phone)
    verify_and_consume_otp(db, channel="phone", identifier=phone, purpose="register", otp=req.otp)

    existing = db.query(Student).filter(Student.phone == phone).first()
    if existing:
        raise HTTPException(status_code=409, detail="Account already exists. Please log in.")

    digits = re.sub(r"\D", "", phone)
    placeholder_email = f"phone_{digits}@ai-tutor.local"

    new_student = Student(
        name=(req.name or "").strip() or "Student",
        email=placeholder_email,
        password=None,
        phone=phone,
        auth_provider="phone_otp",
        # New FK-based references
        board_id=req.board_id,
        grade_id=req.grade_id,
        language_id=req.language_id,
        # Legacy string fields
        grade_band=req.grade_band,
        board=req.board,
        medium=req.medium,
        goal=req.goal,
        preferred_subject_ids=json.dumps(req.preferred_subject_ids) if req.preferred_subject_ids else None,
        is_active=1,
    )
    db.add(new_student)
    db.commit()
    db.refresh(new_student)

    return {
        "message": "Registration successful",
        "student": serialize_student(new_student),
    }


@router.post("/password_reset/request")
def request_password_reset(req: PasswordResetRequest, db: Session = Depends(get_db)):
    email = normalize_email(req.email)
    student = db.query(Student).filter(Student.email == email).first()
    if not student:
        raise HTTPException(status_code=404, detail="No account found for this email.")

    code = f"{secrets.randbelow(1_000_000):06d}"
    record = OtpCode(
        channel="email",
        identifier=email,
        purpose="password_reset",
        otp_hash=compute_otp_hash(code, email, "password_reset"),
        expires_at=datetime.utcnow() + timedelta(minutes=OTP_TTL_MINUTES),
        attempts=0,
    )
    db.add(record)
    db.commit()

    print(f"[OTP] purpose=password_reset channel=email identifier={email} otp={code}")
    response = {"success": True, "message": "Password reset OTP sent"}
    if OTP_ECHO:
        response["dev_otp"] = code
    return response


@router.post("/password_reset/confirm")
def confirm_password_reset(req: PasswordResetConfirmRequest, db: Session = Depends(get_db)):
    email = normalize_email(req.email)
    verify_and_consume_otp(db, channel="email", identifier=email, purpose="password_reset", otp=req.otp)

    student = db.query(Student).filter(Student.email == email).first()
    if not student:
        raise HTTPException(status_code=404, detail="No account found for this email.")

    student.password = hash_password(req.new_password)
    student.auth_provider = "email_password"
    db.commit()
    db.refresh(student)

    return {"success": True, "message": "Password updated successfully"}

@router.post("/{student_id}/toggle_active")
def toggle_student_active(student_id: str, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
        
    # Toggle status (1 -> 0, 0 -> 1)
    student.is_active = 1 if student.is_active == 0 else 0
    db.commit()
    
    status_str = "active" if student.is_active else "inactive"
    return {"message": f"Student is now {status_str}", "is_active": bool(student.is_active)}
