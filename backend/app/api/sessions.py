"""
API endpoints for managing medical sessions
"""

from fastapi import APIRouter, Depends, HTTPException, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
import uuid

from ..models.database import get_db, Session as SessionModel
from ..services.ai_service import AIService

router = APIRouter()
ai_service = AIService()


@router.post("/")
async def create_session(
    doctor_name: str = Form(...),
    patient_name: str = Form(...),
    db: Session = Depends(get_db)
):
    """Create a new medical session"""
    session_id = str(uuid.uuid4())
    
    db_session = SessionModel(
        session_id=session_id,
        doctor_name=doctor_name,
        patient_name=patient_name,
        transcript="",
        created_at=datetime.utcnow()
    )
    
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    
    return {
        "session_id": session_id,
        "doctor_name": doctor_name,
        "patient_name": patient_name,
        "created_at": db_session.created_at
    }


@router.get("/{session_id}")
async def get_session(session_id: str, db: Session = Depends(get_db)):
    """Get session details"""
    session = db.query(SessionModel).filter(SessionModel.session_id == session_id).first()
    
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    return {
        "session_id": session.session_id,
        "doctor_name": session.doctor_name,
        "patient_name": session.patient_name,
        "transcript": session.transcript,
        "soap_note": session.soap_note,
        "patient_summary": session.patient_summary,
        "compliance_report": session.compliance_report,
        "qr_code_url": session.qr_code_url,
        "created_at": session.created_at,
        "updated_at": session.updated_at
    }


@router.put("/{session_id}/transcript")
async def update_transcript(
    session_id: str,
    transcript: str = Form(...),
    db: Session = Depends(get_db)
):
    """Update session transcript"""
    session = db.query(SessionModel).filter(SessionModel.session_id == session_id).first()
    
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session.transcript = transcript
    session.updated_at = datetime.utcnow()
    
    db.commit()
    
    return {"message": "Transcript updated successfully"}


@router.put("/{session_id}/soap")
async def update_soap_note(
    session_id: str,
    soap_note: dict,
    db: Session = Depends(get_db)
):
    """Update session SOAP note"""
    session = db.query(SessionModel).filter(SessionModel.session_id == session_id).first()
    
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session.soap_note = soap_note
    session.updated_at = datetime.utcnow()
    
    db.commit()
    
    return {"message": "SOAP note updated successfully"}


@router.put("/{session_id}/summary")
async def update_patient_summary(
    session_id: str,
    summary: str,
    db: Session = Depends(get_db)
):
    """Update patient summary"""
    session = db.query(SessionModel).filter(SessionModel.session_id == session_id).first()
    
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session.patient_summary = summary
    session.updated_at = datetime.utcnow()
    
    db.commit()
    
    return {"message": "Patient summary updated successfully"}


@router.post("/{session_id}/edit-summary")
async def edit_summary_with_prompt(
    session_id: str,
    edit_prompt: str = Form(...),
    db: Session = Depends(get_db)
):
    """Edit patient summary using AI with doctor's prompt"""
    session = db.query(SessionModel).filter(SessionModel.session_id == session_id).first()
    
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    if not session.patient_summary:
        raise HTTPException(status_code=400, detail="No patient summary to edit")
    
    # Use AI service to edit the summary
    edited_summary = await ai_service.edit_summary_with_prompt(
        session.patient_summary,
        edit_prompt
    )
    
    # Update the session
    session.patient_summary = edited_summary
    session.updated_at = datetime.utcnow()
    
    db.commit()
    
    return {
        "message": "Summary edited successfully",
        "updated_summary": edited_summary
    }


@router.get("/")
async def list_sessions(
    limit: int = 50,
    offset: int = 0,
    db: Session = Depends(get_db)
):
    """List all sessions"""
    sessions = db.query(SessionModel).offset(offset).limit(limit).all()
    
    return [
        {
            "session_id": session.session_id,
            "doctor_name": session.doctor_name,
            "patient_name": session.patient_name,
            "created_at": session.created_at,
            "has_transcript": bool(session.transcript),
            "has_soap_note": bool(session.soap_note),
            "has_summary": bool(session.patient_summary)
        }
        for session in sessions
    ]


@router.delete("/{session_id}")
async def delete_session(session_id: str, db: Session = Depends(get_db)):
    """Delete a session"""
    session = db.query(SessionModel).filter(SessionModel.session_id == session_id).first()
    
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    db.delete(session)
    db.commit()
    
    return {"message": "Session deleted successfully"}
