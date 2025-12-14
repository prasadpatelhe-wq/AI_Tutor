"""
Security utilities for authentication and password handling.
Centralizes all security-related functions to avoid duplication.
"""

import os
import re
import hmac
import hashlib
import secrets
from datetime import datetime, timedelta
from typing import Optional
import bcrypt
from dotenv import load_dotenv

load_dotenv()

# OTP Configuration - MUST be set in production
OTP_SECRET = os.environ.get("OTP_SECRET")
OTP_TTL_SECONDS = int(os.environ.get("OTP_TTL_SECONDS", "300"))  # 5 minutes
OTP_MAX_ATTEMPTS = int(os.environ.get("OTP_MAX_ATTEMPTS", "5"))

# Check for production environment
IS_PRODUCTION = os.environ.get("ENVIRONMENT", "development").lower() == "production"

if IS_PRODUCTION and not OTP_SECRET:
    raise RuntimeError("OTP_SECRET environment variable must be set in production!")

# Use a secure default only in development
if not OTP_SECRET:
    OTP_SECRET = "dev-insecure-otp-secret-" + secrets.token_hex(16)
    print("WARNING: Using auto-generated OTP_SECRET. Set OTP_SECRET env var for production!")


def normalize_phone(phone: str) -> str:
    """
    Normalize phone number to E.164 format.
    Assumes Indian numbers (+91) for 10-digit inputs.
    """
    if not phone:
        return ""

    # Remove all non-digit characters except leading +
    cleaned = re.sub(r'[^\d+]', '', phone)

    # Handle different formats
    if cleaned.startswith('+'):
        return cleaned
    elif len(cleaned) == 10:
        # Assume Indian number
        return f"+91{cleaned}"
    elif len(cleaned) == 11 and cleaned.startswith('0'):
        # Remove leading 0, assume Indian
        return f"+91{cleaned[1:]}"
    elif len(cleaned) == 12 and cleaned.startswith('91'):
        return f"+{cleaned}"

    return cleaned


def normalize_email(email: str) -> str:
    """Normalize email to lowercase and strip whitespace."""
    return (email or "").strip().lower()


def compute_otp_hash(identifier: str, otp: str, purpose: str) -> str:
    """
    Compute HMAC-SHA256 hash of OTP for secure storage.
    Uses identifier and purpose to prevent OTP reuse across different contexts.
    """
    message = f"{identifier}:{otp}:{purpose}"
    return hmac.new(
        OTP_SECRET.encode(),
        message.encode(),
        hashlib.sha256
    ).hexdigest()


def verify_otp_hash(identifier: str, otp: str, purpose: str, stored_hash: str) -> bool:
    """Verify OTP against stored hash using constant-time comparison."""
    computed = compute_otp_hash(identifier, otp, purpose)
    return hmac.compare_digest(computed, stored_hash)


def generate_otp(length: int = 6) -> str:
    """Generate a cryptographically secure OTP."""
    return ''.join(secrets.choice('0123456789') for _ in range(length))


def hash_password(password: str) -> str:
    """Hash password using bcrypt."""
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def verify_password(password: str, hashed: str) -> bool:
    """
    Verify password against hash.
    Supports both bcrypt (preferred) and legacy SHA-256 (for migration).
    Returns tuple of (is_valid, needs_upgrade).
    """
    if not password or not hashed:
        return False

    # Try bcrypt first (current standard)
    try:
        if bcrypt.checkpw(password.encode(), hashed.encode()):
            return True
    except (ValueError, TypeError):
        pass

    # Fallback to legacy SHA-256 (for migration)
    legacy_hash = hashlib.sha256(password.encode()).hexdigest()
    return hmac.compare_digest(legacy_hash, hashed)


def password_needs_upgrade(hashed: str) -> bool:
    """Check if password hash needs upgrade from SHA-256 to bcrypt."""
    if not hashed:
        return False
    # bcrypt hashes start with $2a$, $2b$, or $2y$
    return not hashed.startswith('$2')


def get_otp_expiry() -> datetime:
    """Get OTP expiry timestamp."""
    return datetime.utcnow() + timedelta(seconds=OTP_TTL_SECONDS)


# JWT Configuration (for authentication)
JWT_SECRET = os.environ.get("JWT_SECRET")
JWT_ALGORITHM = "HS256"
JWT_EXPIRY_HOURS = int(os.environ.get("JWT_EXPIRY_HOURS", "24"))

if IS_PRODUCTION and not JWT_SECRET:
    raise RuntimeError("JWT_SECRET environment variable must be set in production!")

if not JWT_SECRET:
    JWT_SECRET = "dev-insecure-jwt-secret-" + secrets.token_hex(32)
    print("WARNING: Using auto-generated JWT_SECRET. Set JWT_SECRET env var for production!")
