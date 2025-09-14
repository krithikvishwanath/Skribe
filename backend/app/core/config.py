"""
Configuration settings for Skribe backend
"""

import os
from typing import List
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # OpenAI Configuration
    OPENAI_API_KEY: str = ""
    
    # Database Configuration
    DATABASE_URL: str = "sqlite:///./skribe.db"
    
    # Security
    SECRET_KEY: str = "your-secret-key-here"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]
    
    # AI Model Settings
    WHISPER_MODEL: str = "whisper-1"
    GPT_MODEL: str = "gpt-4"
    
    # File Upload Settings
    MAX_AUDIO_FILE_SIZE: int = 25 * 1024 * 1024  # 25MB
    ALLOWED_AUDIO_EXTENSIONS: List[str] = [".mp3", ".wav", ".m4a", ".webm"]
    
    class Config:
        case_sensitive = True
        env_file = ".env"


# Global settings instance
settings = Settings()
