from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from backend.database import SessionLocal
from backend.models.students import Student
from backend.schemas import StudentRegisterRequest, StudentLoginRequest
import hashlib
import bcrypt

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

@router.post("/register")
def register_student(req: StudentRegisterRequest, db: Session = Depends(get_db)):
    # Check if email already exists
    existing_student = db.query(Student).filter(Student.email == req.email).first()
    if existing_student:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_student = Student(
        name=req.name,
        email=req.email,
        password=hash_password(req.password),
        grade_band=req.grade_band,
        board=req.board,
        medium=req.medium,
        is_active=1 # Default to active
    )
    db.add(new_student)
    db.commit()
    db.refresh(new_student)
    
    return {"message": "Registration successful", "student_id": new_student.id, "name": new_student.name}

@router.post("/login")
def login_student(req: StudentLoginRequest, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.email == req.email).first()
    
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
        "student": {
            "id": student.id,
            "name": student.name,
            "email": student.email,
            "grade_band": student.grade_band,
            "board": student.board
        }
    }

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
