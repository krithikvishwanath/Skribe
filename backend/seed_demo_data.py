#!/usr/bin/env python3
"""
Demo data seeder for Skribe
Creates sample sessions for demonstration purposes
"""

import asyncio
import json
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models.database import SessionLocal, Session as SessionModel

# Sample demo data
DEMO_SESSIONS = [
    {
        "session_id": "demo-001",
        "doctor_name": "Sarah Johnson",
        "patient_name": "John Smith",
        "transcript": """Doctor: Good morning, John. How are you feeling today?

Patient: Hi Dr. Johnson. I've been having this persistent cough for about two weeks now, and it's been getting worse. I'm also feeling quite tired.

Doctor: I see. Can you tell me more about the cough? Is it dry or are you bringing anything up?

Patient: It's mostly dry, but sometimes I do cough up a little bit of clear mucus. It's worse at night and in the morning.

Doctor: Any fever or shortness of breath?

Patient: I had a low-grade fever for a few days last week, but that's gone now. I do feel a bit short of breath when I climb stairs.

Doctor: Any chest pain?

Patient: Not really chest pain, but my chest feels tight sometimes.

Doctor: Let me examine you. Your temperature is normal today at 98.6°F. Blood pressure is 120/80, which is good. Heart rate is 72 beats per minute. Let me listen to your lungs... I can hear some mild wheezing on the right side.

Patient: Is that serious?

Doctor: It could be a respiratory infection or possibly early bronchitis. I'd like to get a chest X-ray to rule out pneumonia. I'm also going to prescribe an inhaler to help with the wheezing and a cough suppressant.

Patient: Okay, that sounds good. When should I come back?

Doctor: Let's schedule a follow-up in one week. If your symptoms worsen or you develop a high fever, please come in sooner.""",
        
        "soap_note": {
            "subjective": {
                "chief_complaint": "Persistent cough for 2 weeks, worsening, with fatigue",
                "history_present_illness": "Patient reports dry cough with occasional clear mucus production, worse at night and morning. Associated with mild shortness of breath on exertion and intermittent chest tightness. Had low-grade fever last week, now resolved.",
                "review_of_systems": "Positive for cough, fatigue, mild dyspnea on exertion. Negative for chest pain, current fever.",
                "past_medical_history": "Not discussed",
                "medications": "Not discussed",
                "allergies": "Not discussed",
                "social_history": "Not discussed"
            },
            "objective": {
                "vital_signs": {
                    "temperature": "98.6°F",
                    "blood_pressure": "120/80 mmHg",
                    "heart_rate": "72 bpm",
                    "respiratory_rate": "Not recorded",
                    "oxygen_saturation": "Not recorded"
                },
                "physical_exam": "Mild wheezing heard on right side of chest on auscultation",
                "diagnostic_tests": "Chest X-ray ordered"
            },
            "assessment": {
                "primary_diagnosis": "Respiratory infection vs. early bronchitis",
                "differential_diagnoses": ["Pneumonia", "Viral upper respiratory infection", "Asthma exacerbation"],
                "clinical_impression": "Likely respiratory infection with mild bronchospasm"
            },
            "plan": {
                "treatment": "Inhaler for wheezing, cough suppressant",
                "medications": ["Inhaler (bronchodilator)", "Cough suppressant"],
                "follow_up": "Return in 1 week, sooner if symptoms worsen or fever develops",
                "patient_education": "Explained symptoms to watch for, when to return",
                "additional_testing": "Chest X-ray to rule out pneumonia"
            }
        },
        
        "patient_summary": """Hi John,

Here's a summary of your visit today with Dr. Johnson:

**What you came in for:**
You've had a persistent cough for about 2 weeks that's been getting worse, along with feeling tired. The cough is mostly dry but sometimes brings up clear mucus, and it's worse at night and in the morning.

**What we found:**
Your vital signs look good - normal temperature, blood pressure, and heart rate. When Dr. Johnson listened to your lungs, she heard some mild wheezing on the right side. This suggests you might have a respiratory infection or early bronchitis.

**Your treatment plan:**
- We're giving you an inhaler to help with the wheezing
- A cough suppressant to help you feel more comfortable
- We've ordered a chest X-ray to make sure you don't have pneumonia

**What to do next:**
- Come back for a follow-up appointment in one week
- If your symptoms get worse or you develop a high fever, please come in sooner
- Use your medications as directed

**Important:** If you have trouble breathing, severe chest pain, or high fever, don't wait - come in right away or go to the emergency room.

Take care, and we'll see you next week!

Dr. Johnson's Office""",
        
        "compliance_report": {
            "compliance_score": 75,
            "missing_items": [
                {
                    "category": "Vital Signs",
                    "item": "Respiratory rate and oxygen saturation not recorded",
                    "severity": "medium",
                    "suggestion": "Complete vital signs should include respiratory rate and oxygen saturation"
                },
                {
                    "category": "History",
                    "item": "Past medical history not documented",
                    "severity": "high",
                    "suggestion": "Past medical history is important for proper assessment"
                },
                {
                    "category": "Medications",
                    "item": "Current medications not reviewed",
                    "severity": "high",
                    "suggestion": "Medication reconciliation should be performed at each visit"
                },
                {
                    "category": "Allergies",
                    "item": "Allergy information not documented",
                    "severity": "high",
                    "suggestion": "Allergy status must be documented before prescribing medications"
                }
            ],
            "recommendations": [
                "Document complete vital signs including respiratory rate and oxygen saturation",
                "Obtain and document past medical history",
                "Perform medication reconciliation",
                "Verify and document allergy status",
                "Consider documenting social history including smoking status for respiratory complaints"
            ],
            "overall_assessment": "Good documentation of chief complaint and physical exam findings. Missing key elements of medical history and incomplete vital signs."
        },
        
        "created_at": datetime.now() - timedelta(hours=2)
    },
    
    {
        "session_id": "demo-002",
        "doctor_name": "Michael Chen",
        "patient_name": "Emma Davis",
        "transcript": """Doctor: Hello Emma, what brings you in today?

Patient: Hi Dr. Chen. I've been having really bad headaches for the past month. They're different from my usual headaches.

Doctor: Can you describe how they're different?

Patient: They're much more intense, and they seem to happen every day now. Usually around my temples and forehead. Sometimes I feel nauseous too.

Doctor: On a scale of 1 to 10, how would you rate the pain?

Patient: Usually around 7 or 8. Sometimes it gets so bad I can't concentrate at work.

Doctor: Any triggers you've noticed?

Patient: I think stress might be a factor. I've been working a lot of overtime lately. Also, I haven't been sleeping well.

Doctor: Any vision changes, sensitivity to light?

Patient: Yes, bright lights make it worse. No vision changes though.

Doctor: Let me check your blood pressure... 140/90. That's a bit elevated. How's your blood pressure usually?

Patient: I'm not sure, I don't check it regularly.

Doctor: Any family history of high blood pressure or migraines?

Patient: My mom has high blood pressure, and my sister gets migraines.

Doctor: I'm going to start you on a blood pressure medication and recommend some lifestyle changes. For the headaches, let's try a preventive medication.""",
        
        "created_at": datetime.now() - timedelta(hours=5)
    }
]


async def seed_demo_data():
    """Seed the database with demo data"""
    print("🌱 Seeding demo data...")
    
    db = SessionLocal()
    try:
        # Check if demo data already exists
        existing = db.query(SessionModel).filter(SessionModel.session_id.startswith("demo-")).first()
        if existing:
            print("ℹ️  Demo data already exists. Skipping...")
            return
        
        # Create demo sessions
        for session_data in DEMO_SESSIONS:
            db_session = SessionModel(
                session_id=session_data["session_id"],
                doctor_name=session_data["doctor_name"],
                patient_name=session_data["patient_name"],
                transcript=session_data["transcript"],
                soap_note=session_data.get("soap_note"),
                patient_summary=session_data.get("patient_summary"),
                compliance_report=session_data.get("compliance_report"),
                created_at=session_data["created_at"],
                updated_at=session_data["created_at"]
            )
            db.add(db_session)
        
        db.commit()
        print(f"✅ Created {len(DEMO_SESSIONS)} demo sessions")
        
        # Print session details
        for session in DEMO_SESSIONS:
            print(f"   📋 {session['patient_name']} with Dr. {session['doctor_name']}")
    
    except Exception as e:
        print(f"❌ Error seeding demo data: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    asyncio.run(seed_demo_data())
