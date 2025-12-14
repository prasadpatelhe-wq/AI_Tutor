from backend.database import Base
from sqlalchemy import Column, DateTime, Integer, String, Index
from datetime import datetime
import uuid


class OtpCode(Base):
    __tablename__ = "otp_codes"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    channel = Column(String(10), nullable=False)  # "phone" | "email"
    identifier = Column(String(200), nullable=False)  # phone or email
    purpose = Column(String(30), nullable=False)  # "login" | "register" | "password_reset" | "parent"
    otp_hash = Column(String(64), nullable=False)
    expires_at = Column(DateTime, nullable=False)
    consumed_at = Column(DateTime, nullable=True)
    attempts = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    __table_args__ = (
        Index("ix_otp_identifier_purpose_created", "identifier", "purpose", "created_at"),
    )

