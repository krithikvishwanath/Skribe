# Skribe Demo Guide 🏥

This guide will walk you through demonstrating all the features of Skribe - Smart Ambient Healthcare Dictation Service.

## 🚀 Quick Demo Setup

### 1. Start the Application
```bash
# Make sure you're in the project root
cd /path/to/Skribe

# Start both backend and frontend
./start.sh
```

### 2. Set Your OpenAI API Key
```bash
# Edit the backend environment file
nano backend/.env

# Add your OpenAI API key:
OPENAI_API_KEY=your_actual_openai_api_key_here
```

### 3. Seed Demo Data (Optional)
```bash
cd backend
source venv/bin/activate
python seed_demo_data.py
```

## 🎭 Demo Flow

### Part 1: Landing Page & Navigation (2 minutes)

1. **Open the Application**
   - Navigate to http://localhost:3000
   - Show the beautiful dark purple theme
   - Point out the medical branding with stethoscope icon

2. **Highlight Key Features**
   - Real-time transcription
   - SOAP note generation
   - Patient summaries with QR codes
   - Compliance checking

3. **Navigation**
   - Click "Dashboard" to see existing sessions
   - Click "Start Session" to begin new consultation

### Part 2: Dashboard Overview (3 minutes)

1. **Statistics Cards**
   - Show total sessions, completed notes, pending reviews
   - Explain the different status indicators

2. **Session List**
   - Demo search functionality
   - Show session status indicators (transcript, SOAP, summary)
   - Click on a demo session to view details

3. **Session Details View**
   - Show completed SOAP note structure
   - Display patient summary
   - Demonstrate QR code generation

### Part 3: Live Session Demo (10 minutes)

1. **Create New Session**
   - Click "Start Session" or "New Session"
   - Fill in doctor name: "Dr. Demo"
   - Fill in patient name: "Test Patient"
   - Click "Start Medical Session"

2. **Real-time Transcription**
   - Click "Start Recording" (allow microphone access)
   - Speak a sample medical conversation:

   ```
   Sample Script:
   "Hello, I'm Dr. Demo. What brings you in today?"
   
   "Hi Doctor, I've been having chest pain for the past few days. 
   It's a sharp pain that comes and goes, especially when I take deep breaths."
   
   "I see. On a scale of 1 to 10, how would you rate the pain?"
   
   "I'd say it's about a 6 or 7 when it happens."
   
   "Any shortness of breath or dizziness?"
   
   "A little shortness of breath, but no dizziness."
   
   "Let me check your vital signs. Your blood pressure is 130 over 85, 
   heart rate is 88 beats per minute, and temperature is 98.6 degrees."
   
   "I'm going to order an EKG and chest X-ray to rule out any serious conditions. 
   In the meantime, I'll prescribe some pain medication and we'll schedule 
   a follow-up in one week."
   ```

3. **Stop Recording**
   - Click "Stop Recording"
   - Show the live transcript that appeared in real-time

### Part 4: AI-Powered Documentation (5 minutes)

1. **Generate SOAP Note**
   - Click "Generate SOAP Note"
   - Wait for AI processing (show loading state)
   - Navigate to "SOAP Note" tab
   - Explain the structured format:
     - **Subjective**: Patient's symptoms and history
     - **Objective**: Physical exam findings and vital signs
     - **Assessment**: Diagnosis and clinical impression
     - **Plan**: Treatment and follow-up instructions

2. **Generate Patient Summary**
   - Click "Generate Summary"
   - Navigate to "Patient Summary" tab
   - Show plain English summary suitable for patients

3. **Compliance Check**
   - Click "Check Compliance"
   - Navigate to "Compliance" tab
   - Show missing information alerts
   - Explain compliance score and recommendations

### Part 5: Patient Experience (3 minutes)

1. **Generate QR Code**
   - In the Patient Summary tab, click "Generate QR Code"
   - Show the QR code that appears
   - Explain how patients can access their summary

2. **Patient View**
   - Use your phone to scan the QR code, or
   - Copy the URL and open in a new browser window
   - Show the patient-friendly interface
   - Demonstrate download functionality

3. **Summary Editing**
   - Back in the main session, click "Edit Summary"
   - Type an edit prompt like: "Make it more reassuring and add information about when to call the doctor"
   - Click send and show the AI-updated summary

## 🎯 Key Demo Points to Emphasize

### Technical Innovation
- **Real-time AI Transcription**: Using OpenAI Whisper API
- **Medical AI**: GPT-4 for clinical documentation
- **WebSocket Technology**: Live updates without page refresh
- **Modern Architecture**: FastAPI backend, Next.js frontend

### Healthcare Value
- **Time Saving**: Automated documentation reduces administrative burden
- **Accuracy**: AI-powered clinical note generation
- **Patient Engagement**: QR code summaries improve patient experience
- **Compliance**: Built-in checking for missing information

### User Experience
- **Intuitive Interface**: Clean, medical-professional design
- **Real-time Feedback**: Immediate transcription and processing
- **Mobile Friendly**: Responsive design works on all devices
- **Accessibility**: Patient summaries in plain English

## 🛠️ Troubleshooting Demo Issues

### Audio Not Working
- Check microphone permissions in browser
- Ensure you're using HTTPS or localhost
- Try a different browser (Chrome recommended)

### AI Services Not Working
- Verify OpenAI API key is set correctly
- Check backend logs for API errors
- Ensure sufficient API credits

### WebSocket Connection Issues
- Check that backend is running on port 8000
- Verify WebSocket URL in frontend configuration
- Look for CORS issues in browser console

## 📊 Demo Metrics to Track

During the demo, you can highlight:
- **Transcription Speed**: Real-time processing
- **SOAP Note Quality**: Structured, comprehensive documentation
- **Time Savings**: Compare to manual note-taking
- **Compliance Score**: Quantified documentation quality

## 🎬 Advanced Demo Features

For longer demos or technical audiences:

1. **Show the Code Structure**
   - Explain modular architecture
   - Demonstrate API documentation at `/docs`
   - Show WebSocket message flow

2. **Customization Options**
   - Edit prompts in AI service
   - Modify compliance rules
   - Adjust UI theme colors

3. **Integration Possibilities**
   - EHR system integration points
   - API endpoints for external systems
   - Webhook notifications

## 🚀 Deployment Demo

Show how easy it is to deploy:
```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000

# Frontend
cd frontend
npm install && npm run build && npm start
```

## 📝 Demo Conclusion

Wrap up by emphasizing:
- **Complete Solution**: From audio to patient summary
- **AI-Powered**: Leveraging latest OpenAI technology
- **Production Ready**: Modular, scalable architecture
- **Healthcare Focused**: Built specifically for medical workflows
- **Easy to Extend**: Clean codebase ready for additional features

**Total Demo Time: ~25 minutes**
**Audience: Healthcare professionals, developers, investors**
**Goal: Showcase technical innovation and healthcare value**
