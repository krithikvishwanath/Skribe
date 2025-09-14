"""
OpenAI Whisper integration for audio transcription
"""

import openai
import base64
import io
import tempfile
import os
from typing import Optional
from ..core.config import settings


class TranscriptionService:
    """Service for handling audio transcription with OpenAI Whisper"""
    
    def __init__(self):
        openai.api_key = settings.OPENAI_API_KEY
        self.client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)
    
    async def transcribe_chunk(self, audio_data: str) -> Optional[str]:
        """
        Transcribe audio chunk using OpenAI Whisper API
        
        Args:
            audio_data: Base64 encoded audio data
            
        Returns:
            Transcribed text or None if transcription fails
        """
        try:
            # Check if API key is set
            if not settings.OPENAI_API_KEY or settings.OPENAI_API_KEY == "your_openai_api_key_here":
                print("Error: OpenAI API key not set properly")
                return None
            
            # Decode base64 audio data
            audio_bytes = base64.b64decode(audio_data)
            
            # Check audio size (minimum 1KB for meaningful audio)
            if len(audio_bytes) < 1024:
                print(f"Audio chunk too small: {len(audio_bytes)} bytes")
                return None
            
            # Create temporary file for Whisper API
            with tempfile.NamedTemporaryFile(delete=False, suffix='.webm') as temp_file:
                temp_file.write(audio_bytes)
                temp_file.flush()
                
                # Transcribe using Whisper
                with open(temp_file.name, 'rb') as audio_file:
                    transcript = self.client.audio.transcriptions.create(
                        model=settings.WHISPER_MODEL,
                        file=audio_file,
                        response_format="text"
                    )
                
                # Clean up temporary file
                os.unlink(temp_file.name)
                
                return transcript.strip() if transcript else None
                
        except Exception as e:
            print(f"Error transcribing audio chunk: {e}")
            print(f"Audio data length: {len(audio_data) if audio_data else 0}")
            print(f"API key present: {bool(settings.OPENAI_API_KEY and settings.OPENAI_API_KEY != 'your_openai_api_key_here')}")
            return None
    
    async def transcribe_file(self, file_path: str) -> Optional[str]:
        """
        Transcribe complete audio file
        
        Args:
            file_path: Path to audio file
            
        Returns:
            Complete transcription or None if transcription fails
        """
        try:
            with open(file_path, 'rb') as audio_file:
                transcript = self.client.audio.transcriptions.create(
                    model=settings.WHISPER_MODEL,
                    file=audio_file,
                    response_format="text"
                )
            
            return transcript.strip() if transcript else None
            
        except Exception as e:
            print(f"Error transcribing audio file: {e}")
            return None
    
    async def transcribe_with_timestamps(self, audio_data: str) -> Optional[dict]:
        """
        Transcribe audio with timestamp information
        
        Args:
            audio_data: Base64 encoded audio data
            
        Returns:
            Dict with transcription and timing info
        """
        try:
            # Decode base64 audio data
            audio_bytes = base64.b64decode(audio_data)
            
            # Create temporary file for Whisper API
            with tempfile.NamedTemporaryFile(delete=False, suffix='.webm') as temp_file:
                temp_file.write(audio_bytes)
                temp_file.flush()
                
                # Transcribe with verbose JSON response
                with open(temp_file.name, 'rb') as audio_file:
                    response = self.client.audio.transcriptions.create(
                        model=settings.WHISPER_MODEL,
                        file=audio_file,
                        response_format="verbose_json"
                    )
                
                # Clean up temporary file
                os.unlink(temp_file.name)
                
                return {
                    "text": response.text,
                    "segments": response.segments if hasattr(response, 'segments') else [],
                    "language": response.language if hasattr(response, 'language') else "en"
                }
                
        except Exception as e:
            print(f"Error transcribing with timestamps: {e}")
            return None
