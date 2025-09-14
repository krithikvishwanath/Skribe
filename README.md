# Scribe - AI-Powered Clinical Documentation & Patient Experience Platform

*HackMIT Healthcare Track 2025*

An intelligent multi-agent system that automates clinical documentation, generates SOAP notes, and enhances patient communication giving physicians their time back while improving healthcare delivery.

## 🏥 The Problem We're Solving

Healthcare providers spend **60-70% of their time** on administrative tasks, with doctors averaging **2-3 hours daily** on transcription and documentation. This $30B+ annual burden reduces patient face-time, increases physician burnout, and degrades the overall healthcare experience.

**Hospital Validation**: We spoke directly with Chiefs of IT at major regional hospitals who confirmed this is their #1 operational pain point and are actively seeking solutions like Scribe for integration.

## 🎯 Our Solution

Scribe transforms clinical workflows through a sophisticated multi-agent AI system that:
- **Transcribes conversations** in real-time with medical context
- **Generates structured SOAP notes** automatically
- **Handles patient communication** and follow-up scheduling
- **Ensures HIPAA compliance** throughout the process
- **Integrates with existing EHR systems** seamlessly

## 🏗️ Multi-Agent Architecture
<img width="833" height="231" alt="Screenshot 2025-09-14 at 12 21 20 PM" src="https://github.com/user-attachments/assets/b2fe48b6-0a4a-450c-9b40-4a1286ee1b02" />

## 🛠️ Technology Stack & Sponsors

### Core Infrastructure
- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: FastAPI, Python, WebSockets
- **Database**: SQLite (demo)
- **AI Services**: OpenAI GPT-4, Whisper API

- ## 🚀 Quick Start

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

### Sponsor Technologies
- **🌊 Windsurf**: Development environment and real-time collaboration
- **🤖 Claude**: Advanced medical reasoning and SOAP note generation
- **🎤 Wispr**: Note and inter-team communication
- **🔧 Toolhouse**: Multi-agent workflow orchestration
- **🔗 Knot**: Inter-agent communication protocol
- **📊 Rox**: Performance monitoring and optimization
- **☁️ Eigencloud**: Healthcare compliance and security categories
- **🔌 Tandemnn**: EHR integration API
- **⚡ Modal**: Scalable cloud infrastructure
- **🤖 Toolhouse MCP**: Automation protocols

## 📊 Market Validation

### Market Opportunity
- **$4.6B** clinical documentation market
- **800,000+** US physicians spending 2+ hours daily on notes
- **Growing telehealth** adoption increases documentation needs
- **Hospital buy-in** confirmed through direct IT leadership conversations

## 🎯 Key Features

### Real-Time Clinical Documentation
- Live transcription with medical context understanding
- Automated SOAP note generation with proper formatting
- Integration with existing EHR systems via API
- HIPAA-compliant data handling and storage

### Patient Experience Enhancement
- Automated follow-up email generation
- Appointment scheduling and medication reminders
- QR code sharing for patient access to summaries
- Plain English explanations of medical information

### Compliance & Quality Assurance
- Built-in HIPAA compliance monitoring
- Audit trail capabilities for all interactions
- Quality checks for complete documentation
- Regulatory compliance category management

## 📈 Impact Metrics

### Quantifiable Benefits
- **Time Savings**: 2-3 hours per physician per day
- **Cost Reduction**: 40-60% decrease in documentation overhead
- **Quality Improvement**: Standardized, complete clinical notes
- **Patient Satisfaction**: Increased face-time and better communication

### Competitive Advantages
- **Patient-Centric**: Focus on UX, not just physician efficiency
- **Multi-Agent Intelligence**: Specialized agents for different tasks
- **Compliance-First**: Built-in HIPAA and regulatory compliance
- **EHR Agnostic**: Works with existing systems
- **Hospital-Validated**: Direct feedback from IT leadership
