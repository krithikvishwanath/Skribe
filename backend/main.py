"""
Skribe Backend - Smart Ambient Healthcare Dictation Service
FastAPI application with WebSocket support for real-time transcription
"""

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
import json
import asyncio
from typing import Dict, List
import uvicorn
from dotenv import load_dotenv

from app.core.config import settings
from app.api import router as api_router
from app.services.websocket_manager import WebSocketManager
from app.services.transcription_service import TranscriptionService
from app.services.ai_service import AIService
from app.models.database import create_tables

# Load environment variables
load_dotenv(dotenv_path='.env')

# Environment variables loaded via load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="Skribe API",
    description="Smart Ambient Healthcare Dictation Service",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
websocket_manager = WebSocketManager()
transcription_service = TranscriptionService()
ai_service = AIService()

# Include API routes
app.include_router(api_router, prefix="/api/v1")

# Create database tables on startup
@app.on_event("startup")
async def startup_event():
    await create_tables()
    print("🚀 Skribe backend started successfully!")
    print(f"📡 WebSocket endpoint: ws://localhost:8000/ws/transcription")
    print(f"🔗 API docs: http://localhost:8000/docs")

@app.get("/")
async def root():
    return {
        "message": "Skribe API is running!",
        "version": "1.0.0",
        "docs": "/docs",
        "websocket": "/ws/transcription"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "skribe-backend"}

# WebSocket endpoint for real-time transcription
@app.websocket("/ws/transcription")
async def websocket_transcription(websocket: WebSocket):
    await websocket_manager.connect(websocket)
    try:
        while True:
            # Receive audio data or commands from client
            data = await websocket.receive_text()
            message = json.loads(data)
            
            if message["type"] == "transcribe_complete_audio":
                # Process complete audio file with Whisper
                audio_data = message["data"]
                transcript = await transcription_service.transcribe_chunk(audio_data)
                
                if transcript:
                    # Send complete transcript back to client
                    await websocket_manager.send_personal_message(
                        json.dumps({
                            "type": "transcript_complete",
                            "data": transcript
                        }),
                        websocket
                    )
            
            elif message["type"] == "generate_soap":
                # Generate SOAP note from complete transcript
                transcript = message["transcript"]
                session_id = message.get("session_id")
                soap_note = await ai_service.generate_soap_note(transcript)
                
                # Save SOAP note to database if session_id provided
                if session_id and soap_note:
                    from app.models.database import SessionLocal, Session as SessionModel
                    from datetime import datetime
                    db = SessionLocal()
                    try:
                        session = db.query(SessionModel).filter(SessionModel.session_id == session_id).first()
                        if session:
                            session.soap_note = soap_note
                            session.updated_at = datetime.utcnow()
                            db.commit()
                    except Exception as e:
                        print(f"Error saving SOAP note to database: {e}")
                        db.rollback()
                    finally:
                        db.close()
                
                await websocket_manager.send_personal_message(
                    json.dumps({
                        "type": "soap_generated",
                        "data": soap_note
                    }),
                    websocket
                )
            
            elif message["type"] == "generate_summary":
                # Generate patient summary
                transcript = message["transcript"]
                session_id = message.get("session_id")
                summary = await ai_service.generate_patient_summary(transcript)
                
                # Save summary to database if session_id provided
                if session_id and summary:
                    from app.models.database import SessionLocal, Session as SessionModel
                    from datetime import datetime
                    db = SessionLocal()
                    try:
                        session = db.query(SessionModel).filter(SessionModel.session_id == session_id).first()
                        if session:
                            session.patient_summary = summary
                            session.updated_at = datetime.utcnow()
                            db.commit()
                    except Exception as e:
                        print(f"Error saving summary to database: {e}")
                        db.rollback()
                    finally:
                        db.close()
                
                await websocket_manager.send_personal_message(
                    json.dumps({
                        "type": "summary_generated",
                        "data": summary
                    }),
                    websocket
                )
            
            elif message["type"] == "compliance_check":
                # Run compliance check
                soap_note = message["soap_note"]
                compliance_report = await ai_service.check_compliance(soap_note)
                
                await websocket_manager.send_personal_message(
                    json.dumps({
                        "type": "compliance_report",
                        "data": compliance_report
                    }),
                    websocket
                )
                
    except WebSocketDisconnect:
        websocket_manager.disconnect(websocket)
    except Exception as e:
        print(f"WebSocket error: {e}")
        await websocket_manager.send_personal_message(
            json.dumps({
                "type": "error",
                "message": str(e)
            }),
            websocket
        )

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
