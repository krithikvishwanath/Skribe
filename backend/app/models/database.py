"""
Database models and setup for Skribe
"""

from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, JSON, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import os

from ..core.config import settings

# Database setup
engine = create_engine(settings.DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class Session(Base):
    """Database model for medical sessions"""
    __tablename__ = "sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, unique=True, index=True)
    doctor_name = Column(String, index=True)
    patient_name = Column(String, index=True)
    transcript = Column(Text)
    soap_note = Column(JSON)
    patient_summary = Column(Text)
    compliance_report = Column(JSON)
    qr_code_url = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = Column(Boolean, default=True)


class TranscriptChunk(Base):
    """Database model for transcript chunks (real-time updates)"""
    __tablename__ = "transcript_chunks"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, index=True)
    chunk_text = Column(Text)
    timestamp = Column(DateTime, default=datetime.utcnow)
    confidence = Column(String)  # Whisper confidence score


async def create_tables():
    """Create database tables"""
    Base.metadata.create_all(bind=engine)


def get_db():
    """Get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
