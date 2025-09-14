# Skribe - Smart Ambient Healthcare Dictation Service

A hackathon MVP that transforms patient conversations into structured clinical notes with AI-powered transcription and real-time compliance monitoring.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Python 3.9+
- OpenAI API key

### One-Command Setup

1. **Start everything with the demo script**
   ```bash
   # Make the script executable (first time only)
   chmod +x start.sh
   
   # Start both backend and frontend
   ./start.sh
   ```

2. **Set your OpenAI API key**
   ```bash
   # Edit the backend environment file
   nano backend/.env
   
   # Add your OpenAI API key:
   OPENAI_API_KEY=your_openai_api_key_here
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Manual Setup (Alternative)

<details>
<summary>Click to expand manual setup instructions</summary>

1. **Backend Setup**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   cp env.example .env
   # Edit .env with your OpenAI API key
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

2. **Frontend Setup (in a new terminal)**
   ```bash
   cd frontend
   npm install
   cp env.example .env.local
   # Edit .env.local if needed (defaults should work)
   npm run dev
   ```

</details>

### Demo Data (Optional)
```bash
cd backend
source venv/bin/activate
python seed_demo_data.py
```

### 🎬 Ready to Demo?
See the **[Complete Demo Guide](DEMO_GUIDE.md)** for a step-by-step presentation walkthrough.

### 🏥 Health Check
Verify everything is working correctly:
```bash
python health_check.py
```

## 🎯 Demo Flow

1. **Live Transcription**: Doctor and patient speak → live transcript appears
2. **SOAP Note Generation**: Transcript converted into structured clinical notes
3. **Patient Summary**: Plain English summary with QR code for patient access
4. **Compliance Check**: AI agent flags missing required information
5. **Dashboard Storage**: Save all data for demo purposes

## 🏗️ Architecture

```
frontend/          # Next.js + React + Shadcn UI
├── app/           # App router pages
├── components/    # Reusable UI components
├── lib/           # Utilities and configurations
└── public/        # Static assets

backend/           # FastAPI Python backend
├── app/           # Application code
│   ├── api/       # API routes
│   ├── core/      # Core functionality
│   ├── models/    # Data models
│   └── services/  # Business logic
├── requirements.txt
└── main.py        # Entry point
```

## 🔧 Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS, Shadcn UI
- **Backend**: FastAPI, Python, WebSockets
- **AI Services**: OpenAI Whisper API, OpenAI GPT-4
- **Database**: SQLite (for demo)
- **Real-time**: WebSocket connections

## 📱 Features

- **Real-time Audio Transcription** with OpenAI Whisper
- **SOAP Note Generation** with structured medical documentation
- **Patient Summary** in plain English with QR code sharing
- **Compliance Agent** for missing information detection
- **Dark Purple Theme** with modern, professional UI
- **WebSocket Integration** for live updates
- **Modular Architecture** for easy feature additions

## 🚀 Development

The codebase is designed for rapid iteration and easy feature additions:

- **Modular Components**: Each feature is self-contained
- **Clear Separation**: Frontend and backend are decoupled
- **WebSocket Ready**: Real-time updates built-in
- **AI Integration**: OpenAI services abstracted for easy swapping
- **Theme System**: Consistent dark purple design system

## 📝 License

MIT License - Built for hackathon demonstration purposes.
