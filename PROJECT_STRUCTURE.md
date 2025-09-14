# Skribe Project Structure 📁

Complete overview of the Skribe Smart Ambient Healthcare Dictation Service codebase.

```
Skribe/
├── 📄 README.md                    # Main project documentation
├── 📄 DEMO_GUIDE.md               # Step-by-step demo walkthrough
├── 📄 PROJECT_STRUCTURE.md        # This file - project overview
├── 📄 .gitignore                  # Git ignore rules
├── 🚀 start.sh                    # One-command startup script
├── 🏥 health_check.py             # System health verification script
│
├── backend/                       # FastAPI Python Backend
│   ├── 📄 README.md              # Backend documentation
│   ├── 📄 requirements.txt       # Python dependencies
│   ├── 📄 env.example            # Environment variables template
│   ├── 📄 main.py                # FastAPI application entry point
│   ├── 🌱 seed_demo_data.py      # Demo data seeder
│   │
│   └── app/                      # Application code
│       ├── __init__.py
│       │
│       ├── api/                  # API route handlers
│       │   ├── __init__.py       # API router setup
│       │   ├── sessions.py       # Session management endpoints
│       │   └── qr_codes.py       # QR code generation endpoints
│       │
│       ├── core/                 # Core configuration
│       │   ├── __init__.py
│       │   └── config.py         # Settings and environment config
│       │
│       ├── models/               # Database models
│       │   ├── __init__.py
│       │   └── database.py       # SQLAlchemy models and setup
│       │
│       └── services/             # Business logic services
│           ├── __init__.py
│           ├── websocket_manager.py     # WebSocket connection management
│           ├── transcription_service.py # OpenAI Whisper integration
│           └── ai_service.py            # AI-powered medical documentation
│
└── frontend/                     # Next.js React Frontend
    ├── 📄 README.md              # Frontend documentation
    ├── 📄 package.json           # Node.js dependencies and scripts
    ├── 📄 next.config.js         # Next.js configuration
    ├── 📄 tailwind.config.js     # Tailwind CSS configuration
    ├── 📄 postcss.config.js      # PostCSS configuration
    ├── 📄 tsconfig.json          # TypeScript configuration
    ├── 📄 env.example            # Environment variables template
    │
    ├── app/                      # Next.js 14 App Router
    │   ├── 📄 layout.tsx         # Root layout component
    │   ├── 📄 page.tsx           # Landing page (your provided design)
    │   ├── 📄 globals.css        # Global styles and theme
    │   │
    │   ├── dashboard/            # Dashboard pages
    │   │   └── page.tsx          # Main dashboard with session overview
    │   │
    │   ├── session/              # Session management pages
    │   │   ├── new/              # New session creation
    │   │   │   └── page.tsx      # Session creation form
    │   │   └── [id]/             # Dynamic session pages
    │   │       └── page.tsx      # Session details & live transcription
    │   │
    │   └── patient/              # Patient-facing pages
    │       └── [id]/             # QR code accessible patient summaries
    │           └── page.tsx      # Patient summary view
    │
    ├── components/               # Reusable UI components
    │   └── ui/                   # Base UI components
    │       └── button.tsx        # Styled button component
    │
    └── lib/                      # Utility functions
        └── utils.ts              # Helper functions and utilities
```

## 🏗️ Architecture Overview

### Backend Architecture (FastAPI)

**Entry Point**: `main.py`
- FastAPI application setup
- CORS configuration
- WebSocket endpoint for real-time communication
- API route inclusion

**API Layer**: `app/api/`
- **Sessions**: CRUD operations for medical sessions
- **QR Codes**: Generate and serve QR codes for patient summaries

**Services Layer**: `app/services/`
- **WebSocket Manager**: Handle real-time connections
- **Transcription Service**: OpenAI Whisper integration
- **AI Service**: GPT-4 for SOAP notes, summaries, compliance

**Data Layer**: `app/models/`
- **Database Models**: SQLAlchemy models for sessions and transcripts
- **Database Setup**: Connection management and table creation

**Configuration**: `app/core/`
- **Settings**: Environment variables and application configuration

### Frontend Architecture (Next.js)

**App Router Structure**: `app/`
- **Layout**: Root layout with dark theme
- **Pages**: Route-based page components
- **Global Styles**: Tailwind CSS with custom medical theme

**Component System**: `components/`
- **UI Components**: Reusable styled components
- **Theme Integration**: Consistent dark purple design system

**Utilities**: `lib/`
- **Helper Functions**: Common utilities and type definitions

## 🔄 Data Flow

### Real-time Transcription Flow
1. **Audio Capture**: Browser MediaRecorder API
2. **WebSocket Transmission**: Audio chunks sent to backend
3. **Whisper Processing**: OpenAI Whisper API transcription
4. **Live Updates**: Transcribed text sent back via WebSocket
5. **UI Updates**: Real-time transcript display

### SOAP Note Generation Flow
1. **Complete Transcript**: Full conversation text
2. **AI Processing**: GPT-4 structured note generation
3. **Database Storage**: SOAP note saved to session
4. **UI Display**: Formatted SOAP note presentation

### Patient Summary Flow
1. **SOAP Note Input**: Structured clinical data
2. **Plain English Generation**: GPT-4 patient-friendly summary
3. **QR Code Creation**: Generate shareable QR code
4. **Patient Access**: Public patient summary page

### Compliance Checking Flow
1. **SOAP Note Analysis**: Review structured documentation
2. **Gap Identification**: AI identifies missing information
3. **Scoring**: Compliance score calculation
4. **Recommendations**: Actionable improvement suggestions

## 🎨 Design System

### Color Palette
- **Primary**: Purple gradients (#9333EA to #7C3AED)
- **Background**: Black with purple overlays
- **Success**: Green (#22C55E)
- **Warning**: Yellow (#EAB308)
- **Error**: Red (#EF4444)
- **Info**: Blue (#3B82F6)

### Typography
- **Font Family**: DM Sans
- **Hierarchy**: Consistent heading and body text sizes
- **Medical Focus**: Professional, clean typography

### Components
- **Glass Morphism**: Backdrop blur effects
- **Status Indicators**: Color-coded progress tracking
- **Interactive Elements**: Smooth transitions and hover effects

## 🔌 Integration Points

### External APIs
- **OpenAI Whisper**: Audio transcription
- **OpenAI GPT-4**: Medical documentation generation
- **Browser APIs**: MediaRecorder, WebSocket

### Database
- **SQLite**: Development database (easily replaceable)
- **SQLAlchemy**: ORM for database operations

### Communication
- **REST API**: Standard HTTP endpoints
- **WebSocket**: Real-time bidirectional communication
- **JSON**: Data serialization format

## 🚀 Deployment Architecture

### Development
- **Backend**: uvicorn development server
- **Frontend**: Next.js development server
- **Database**: Local SQLite file

### Production Ready
- **Backend**: Gunicorn + uvicorn workers
- **Frontend**: Next.js static export or server deployment
- **Database**: PostgreSQL or MySQL
- **WebSocket**: Redis for session management

## 📦 Dependencies

### Backend Dependencies
- **FastAPI**: Modern web framework
- **SQLAlchemy**: Database ORM
- **OpenAI**: AI service integration
- **WebSockets**: Real-time communication
- **QRCode**: QR code generation
- **Pydantic**: Data validation

### Frontend Dependencies
- **Next.js 14**: React framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Animations
- **Radix UI**: Accessible components
- **Lucide React**: Icon library

## 🔧 Configuration Files

### Backend Configuration
- **requirements.txt**: Python package dependencies
- **env.example**: Environment variable template
- **.env**: Local environment configuration (not in git)

### Frontend Configuration
- **package.json**: Node.js dependencies and scripts
- **next.config.js**: Next.js build configuration
- **tailwind.config.js**: Tailwind CSS customization
- **tsconfig.json**: TypeScript compiler options

## 🛠️ Development Tools

### Scripts
- **start.sh**: One-command startup for both services
- **health_check.py**: Verify system health
- **seed_demo_data.py**: Create sample data for demos

### Code Quality
- **TypeScript**: Static type checking
- **ESLint**: JavaScript/TypeScript linting
- **Prettier**: Code formatting (recommended)

## 📊 File Statistics

```
Total Files: ~25 core files
Backend: ~12 Python files
Frontend: ~10 TypeScript/JavaScript files
Documentation: ~4 Markdown files
Configuration: ~8 config files
```

## 🎯 Key Features by File

### Real-time Transcription
- `websocket_manager.py`: Connection management
- `transcription_service.py`: Whisper integration
- `app/session/[id]/page.tsx`: Live transcription UI

### AI Documentation
- `ai_service.py`: SOAP note and summary generation
- `app/session/[id]/page.tsx`: AI processing interface

### Patient Experience
- `qr_codes.py`: QR code generation
- `app/patient/[id]/page.tsx`: Patient summary view

### Healthcare Dashboard
- `sessions.py`: Session management API
- `app/dashboard/page.tsx`: Medical dashboard UI

This structure provides a clear separation of concerns, making the codebase easy to understand, maintain, and extend for additional healthcare features.
