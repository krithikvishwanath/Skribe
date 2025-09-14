"""
API endpoints for QR code generation and patient summary sharing
"""

from fastapi import APIRouter, Depends, HTTPException, Response
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
import qrcode
import io
import base64
from typing import Optional

from ..models.database import get_db, Session as SessionModel

router = APIRouter()


@router.post("/generate/{session_id}")
async def generate_qr_code(
    session_id: str,
    db: Session = Depends(get_db)
):
    """Generate QR code for patient summary access"""
    session = db.query(SessionModel).filter(SessionModel.session_id == session_id).first()
    
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Create QR code URL (pointing to frontend patient view)
    qr_url = f"http://localhost:3000/patient/{session_id}"
    
    # Generate QR code
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(qr_url)
    qr.make(fit=True)
    
    # Create QR code image
    img = qr.make_image(fill_color="black", back_color="white")
    
    # Convert to base64 for easy transmission
    img_buffer = io.BytesIO()
    img.save(img_buffer, format='PNG')
    img_buffer.seek(0)
    
    # Save QR code URL to database
    session.qr_code_url = qr_url
    db.commit()
    
    # Return base64 encoded image
    img_base64 = base64.b64encode(img_buffer.getvalue()).decode()
    
    return {
        "qr_code_url": qr_url,
        "qr_code_image": f"data:image/png;base64,{img_base64}",
        "session_id": session_id
    }


@router.get("/image/{session_id}")
async def get_qr_code_image(
    session_id: str,
    db: Session = Depends(get_db)
):
    """Get QR code image as PNG"""
    session = db.query(SessionModel).filter(SessionModel.session_id == session_id).first()
    
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    if not session.qr_code_url:
        raise HTTPException(status_code=404, detail="QR code not generated yet")
    
    # Generate QR code image
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(session.qr_code_url)
    qr.make(fit=True)
    
    img = qr.make_image(fill_color="black", back_color="white")
    
    # Return as PNG image
    img_buffer = io.BytesIO()
    img.save(img_buffer, format='PNG')
    img_buffer.seek(0)
    
    return StreamingResponse(
        io.BytesIO(img_buffer.getvalue()),
        media_type="image/png",
        headers={"Content-Disposition": f"inline; filename=qr_code_{session_id}.png"}
    )


@router.get("/summary/{session_id}")
async def get_patient_summary_by_qr(
    session_id: str,
    db: Session = Depends(get_db)
):
    """Get patient summary via QR code access (public endpoint)"""
    session = db.query(SessionModel).filter(SessionModel.session_id == session_id).first()
    
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    if not session.patient_summary:
        raise HTTPException(status_code=404, detail="Patient summary not available")
    
    return {
        "patient_name": session.patient_name,
        "doctor_name": session.doctor_name,
        "summary": session.patient_summary,
        "created_at": session.created_at,
        "session_id": session_id
    }
