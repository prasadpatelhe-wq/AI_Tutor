"""
JWT Authentication utilities for FastAPI.
Provides middleware and dependencies for protecting routes.
"""

import os
from datetime import datetime, timedelta
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
import jwt

from backend.utils.dependencies import get_db
from backend.utils.security import JWT_SECRET, JWT_ALGORITHM, JWT_EXPIRY_HOURS
from backend.models.students import Student

# Security scheme for Swagger UI
security_scheme = HTTPBearer(auto_error=False)


def create_access_token(student_id: str, extra_data: dict = None) -> str:
    """
    Create a JWT access token for a student.

    Args:
        student_id: The student's UUID
        extra_data: Additional claims to include in the token

    Returns:
        Encoded JWT token string
    """
    payload = {
        "sub": student_id,
        "iat": datetime.utcnow(),
        "exp": datetime.utcnow() + timedelta(hours=JWT_EXPIRY_HOURS),
        "type": "access"
    }
    if extra_data:
        payload.update(extra_data)

    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def create_parent_token(student_id: str) -> str:
    """
    Create a JWT token for parent authentication.
    Valid for shorter duration than student tokens.
    """
    payload = {
        "sub": student_id,
        "iat": datetime.utcnow(),
        "exp": datetime.utcnow() + timedelta(hours=2),  # 2 hours for parent session
        "type": "parent"
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def decode_token(token: str) -> Optional[dict]:
    """
    Decode and validate a JWT token.

    Returns:
        Decoded payload if valid, None otherwise
    """
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


def get_current_student(
    credentials: HTTPAuthorizationCredentials = Depends(security_scheme),
    db: Session = Depends(get_db)
) -> Student:
    """
    Dependency to get the current authenticated student.
    Raises HTTPException if not authenticated.

    Usage:
        @router.get("/protected")
        def protected_route(student: Student = Depends(get_current_student)):
            return {"student_id": student.id}
    """
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
            headers={"WWW-Authenticate": "Bearer"}
        )

    payload = decode_token(credentials.credentials)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"}
        )

    if payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token type",
            headers={"WWW-Authenticate": "Bearer"}
        )

    student_id = payload.get("sub")
    student = db.query(Student).filter(Student.id == student_id).first()

    if not student:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Student not found",
            headers={"WWW-Authenticate": "Bearer"}
        )

    if not student.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated"
        )

    return student


def get_current_student_optional(
    credentials: HTTPAuthorizationCredentials = Depends(security_scheme),
    db: Session = Depends(get_db)
) -> Optional[Student]:
    """
    Dependency to get the current student if authenticated, None otherwise.
    Use for routes that work with or without authentication.
    """
    if not credentials:
        return None

    payload = decode_token(credentials.credentials)
    if not payload or payload.get("type") != "access":
        return None

    student_id = payload.get("sub")
    return db.query(Student).filter(
        Student.id == student_id,
        Student.is_active == 1
    ).first()


def verify_parent_token(
    credentials: HTTPAuthorizationCredentials = Depends(security_scheme),
    db: Session = Depends(get_db)
) -> str:
    """
    Dependency to verify parent authentication.
    Returns the student_id associated with the parent session.
    """
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Parent authentication required",
            headers={"WWW-Authenticate": "Bearer"}
        )

    payload = decode_token(credentials.credentials)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired parent token",
            headers={"WWW-Authenticate": "Bearer"}
        )

    if payload.get("type") != "parent":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token type - parent authentication required",
            headers={"WWW-Authenticate": "Bearer"}
        )

    return payload.get("sub")


def get_student_id_from_token_or_param(
    student_id: Optional[str] = None,
    credentials: HTTPAuthorizationCredentials = Depends(security_scheme),
    db: Session = Depends(get_db)
) -> str:
    """
    Get student_id from either URL parameter or JWT token.
    Useful for backward compatibility during migration.
    """
    # If student_id provided, use it (for backward compatibility)
    if student_id:
        return student_id

    # Otherwise, try to get from token
    if credentials:
        payload = decode_token(credentials.credentials)
        if payload and payload.get("type") == "access":
            return payload.get("sub")

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Student ID required - either provide student_id parameter or authenticate"
    )
