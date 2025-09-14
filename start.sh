#!/bin/bash

# Skribe - Smart Ambient Healthcare Dictation Service
# Startup script for development environment

echo "🏥 Starting Skribe - Smart Ambient Healthcare Dictation Service"
echo "=============================================================="

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed."
    exit 1
fi

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed."
    exit 1
fi

# Function to check if backend is ready
wait_for_backend() {
    echo "⏳ Waiting for backend to be ready..."
    while ! curl -s http://localhost:8000/health > /dev/null; do
        sleep 1
    done
    echo "✅ Backend is ready!"
}

# Start backend
echo "🚀 Starting FastAPI backend..."
cd backend

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Check if dependencies are installed
if [ ! -f "venv/pyvenv.cfg" ] || [ ! -d "venv/lib" ]; then
    echo "📦 Installing Python dependencies..."
    pip install -r requirements.txt
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  Creating .env file from template..."
    cp env.example .env
    echo "📝 Please edit backend/.env with your OpenAI API key"
    echo "   OPENAI_API_KEY=your_openai_api_key_here"
fi

# Start backend server in background
echo "🔧 Starting backend server on port 8000..."
uvicorn main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# Wait for backend to be ready
wait_for_backend

# Start frontend
echo "🎨 Starting Next.js frontend..."
cd ../frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing Node.js dependencies..."
    npm install
fi

# Check if .env.local file exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  Creating .env.local file from template..."
    cp env.example .env.local
fi

# Start frontend server
echo "🔧 Starting frontend server on port 3000..."
npm run dev &
FRONTEND_PID=$!

# Display startup information
echo ""
echo "🎉 Skribe is now running!"
echo "=============================================================="
echo "🌐 Frontend:  http://localhost:3000"
echo "🔗 Backend:   http://localhost:8000"
echo "📚 API Docs:  http://localhost:8000/docs"
echo "🔌 WebSocket: ws://localhost:8000/ws/transcription"
echo ""
echo "📝 Features available:"
echo "   ✅ Real-time audio transcription with OpenAI Whisper"
echo "   ✅ AI-powered SOAP note generation"
echo "   ✅ Patient summary with QR code sharing"
echo "   ✅ Compliance checking and validation"
echo "   ✅ Beautiful dark purple theme interface"
echo ""
echo "⚠️  Make sure to set your OpenAI API key in backend/.env"
echo ""
echo "Press Ctrl+C to stop all services"
echo "=============================================================="

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping Skribe services..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "👋 Skribe stopped. Thank you for using our service!"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for services to run
wait
