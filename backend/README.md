# Skribe Backend - FastAPI Medical Transcription Service

Backend service for Skribe's Smart Ambient Healthcare Dictation system. Provides real-time transcription, AI-powered SOAP note generation, patient summaries, and compliance checking.

## 🚀 Quick Start

### Prerequisites
- Python 3.9 or higher
- OpenAI API key

### Installation

1. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Environment setup**
   ```bash
   cp env.example .env
   # Edit .env with your OpenAI API key
   ```

4. **Run the server**
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

The backend will be available at:
- **API**: http://localhost:8000
- **WebSocket**: ws://localhost:8000/ws/transcription
- **Docs**: http://localhost:8000/docs

## 🏗️ Architecture

```
app/
├── api/              # API route handlers
│   ├── sessions.py   # Session management endpoints
│   └── qr_codes.py   # QR code generation endpoints
├── core/             # Core configuration
│   └── config.py     # Settings and configuration
├── models/           # Database models
│   └── database.py   # SQLAlchemy models and setup
└── services/         # Business logic services
    ├── websocket_manager.py    # WebSocket connection management
    ├── transcription_service.py # OpenAI Whisper integration
    └── ai_service.py           # AI-powered medical documentation
```

## 🔌 API Endpoints

### Sessions
- `POST /api/v1/sessions/` - Create new medical session
- `GET /api/v1/sessions/{session_id}` - Get session details
- `PUT /api/v1/sessions/{session_id}/transcript` - Update transcript
- `PUT /api/v1/sessions/{session_id}/soap` - Update SOAP note
- `PUT /api/v1/sessions/{session_id}/summary` - Update patient summary
- `POST /api/v1/sessions/{session_id}/edit-summary` - AI-edit summary
- `GET /api/v1/sessions/` - List all sessions
- `DELETE /api/v1/sessions/{session_id}` - Delete session

### QR Codes
- `POST /api/v1/qr/generate/{session_id}` - Generate QR code
- `GET /api/v1/qr/image/{session_id}` - Get QR code image
- `GET /api/v1/qr/summary/{session_id}` - Get patient summary (public)

### WebSocket
- `ws://localhost:8000/ws/transcription` - Real-time transcription and AI processing

## 🧠 AI Services

### Transcription Service (`transcription_service.py`)
- **OpenAI Whisper Integration**: Real-time audio transcription
- **Multiple Formats**: Support for various audio formats
- **Streaming**: Process audio chunks in real-time
- **Timestamps**: Optional timestamp extraction

### AI Service (`ai_service.py`)
- **SOAP Note Generation**: Convert transcripts to structured clinical notes
- **Patient Summaries**: Generate plain-English summaries
- **Compliance Checking**: Identify missing required information
- **Summary Editing**: AI-powered summary refinement with doctor prompts

### WebSocket Manager (`websocket_manager.py`)
- **Real-time Communication**: Bidirectional WebSocket connections
- **Session Management**: Multi-session support
- **Error Handling**: Robust connection management
- **Broadcasting**: Send updates to specific sessions or all connections

## 💾 Database

Uses SQLite for demo purposes with SQLAlchemy ORM:

### Models
- **Session**: Medical session data (transcript, SOAP note, summary, etc.)
- **TranscriptChunk**: Real-time transcript segments with timestamps

### Schema
```sql
-- Sessions table
CREATE TABLE sessions (
    id INTEGER PRIMARY KEY,
    session_id TEXT UNIQUE,
    doctor_name TEXT,
    patient_name TEXT,
    transcript TEXT,
    soap_note JSON,
    patient_summary TEXT,
    compliance_report JSON,
    qr_code_url TEXT,
    created_at DATETIME,
    updated_at DATETIME,
    is_active BOOLEAN
);

-- Transcript chunks table
CREATE TABLE transcript_chunks (
    id INTEGER PRIMARY KEY,
    session_id TEXT,
    chunk_text TEXT,
    timestamp DATETIME,
    confidence TEXT
);
```

## 🔧 Configuration

### Environment Variables (.env)
```bash
OPENAI_API_KEY=your_openai_api_key_here
DATABASE_URL=sqlite:///./skribe.db
SECRET_KEY=your_secret_key_here
CORS_ORIGINS=["http://localhost:3000"]
```

### Settings (config.py)
- **OpenAI Configuration**: API key, model settings
- **Database**: Connection URL and settings
- **Security**: JWT tokens, CORS origins
- **File Upload**: Size limits, allowed formats

## 🌐 WebSocket Protocol

### Client → Server Messages

**Audio Chunk**
```json
{
  "type": "audio_chunk",
  "data": "base64_encoded_audio_data",
  "timestamp": "2023-12-01T10:00:00Z"
}
```

**Generate SOAP Note**
```json
{
  "type": "generate_soap",
  "transcript": "Complete conversation transcript..."
}
```

**Generate Patient Summary**
```json
{
  "type": "generate_summary",
  "transcript": "Complete conversation transcript..."
}
```

**Compliance Check**
```json
{
  "type": "compliance_check",
  "soap_note": { /* SOAP note object */ }
}
```

### Server → Client Messages

**Transcript Chunk**
```json
{
  "type": "transcript_chunk",
  "data": "Transcribed text segment",
  "timestamp": "2023-12-01T10:00:00Z"
}
```

**SOAP Note Generated**
```json
{
  "type": "soap_generated",
  "data": {
    "subjective": { /* ... */ },
    "objective": { /* ... */ },
    "assessment": { /* ... */ },
    "plan": { /* ... */ }
  }
}
```

**Patient Summary Generated**
```json
{
  "type": "summary_generated",
  "data": "Plain English patient summary..."
}
```

**Compliance Report**
```json
{
  "type": "compliance_report",
  "data": {
    "compliance_score": 85,
    "missing_items": [/* ... */],
    "recommendations": [/* ... */],
    "overall_assessment": "Good documentation with minor gaps"
  }
}
```

## 🧪 Development

### Running in Development
```bash
# Install development dependencies
pip install -r requirements.txt

# Run with auto-reload
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# View API documentation
open http://localhost:8000/docs
```

### Testing WebSocket Connection
```javascript
const ws = new WebSocket('ws://localhost:8000/ws/transcription');
ws.onopen = () => console.log('Connected');
ws.onmessage = (event) => console.log('Message:', JSON.parse(event.data));
```

## 🔒 Security & Compliance

- **HIPAA Considerations**: Secure audio processing and data handling
- **Data Encryption**: All sensitive data is encrypted in transit
- **API Security**: CORS configuration for frontend integration
- **Privacy**: Audio data is processed securely and not permanently stored

## 📝 Logging

The application logs important events:
- WebSocket connections/disconnections
- Transcription requests and responses
- AI service calls and errors
- Database operations

## 🚨 Error Handling

Comprehensive error handling for:
- OpenAI API failures
- WebSocket connection issues
- Database connection problems
- Invalid audio data
- Missing environment variables

## 🔄 Scalability Notes

For production deployment:
- Replace SQLite with PostgreSQL/MySQL
- Add Redis for WebSocket session management
- Implement proper logging and monitoring
- Add authentication and authorization
- Use environment-specific configuration
- Add rate limiting and request validation
