"""
AI service for SOAP note generation, patient summaries, and compliance checking
"""

import openai
import json
from typing import Dict, List, Optional
from ..core.config import settings


class AIService:
    """Service for AI-powered medical documentation processing"""
    
    def __init__(self):
        self.client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)
    
    async def generate_soap_note(self, transcript: str) -> Dict:
        """
        Generate structured SOAP note from conversation transcript
        
        Args:
            transcript: Raw conversation transcript
            
        Returns:
            Structured SOAP note dictionary
        """
        try:
            prompt = f"""
            You are a medical AI assistant. Convert the following doctor-patient conversation transcript into a structured SOAP note format.

            Transcript:
            {transcript}

            Generate a SOAP note with the following structure:
            {{
                "subjective": {{
                    "chief_complaint": "Patient's main concern",
                    "history_present_illness": "Detailed description of current symptoms",
                    "review_of_systems": "Relevant systems review",
                    "past_medical_history": "Relevant past medical history",
                    "medications": ["Current medications"],
                    "allergies": ["Known allergies"],
                    "social_history": "Relevant social history"
                }},
                "objective": {{
                    "vital_signs": {{
                        "blood_pressure": "BP if mentioned",
                        "heart_rate": "HR if mentioned",
                        "temperature": "Temp if mentioned",
                        "respiratory_rate": "RR if mentioned",
                        "oxygen_saturation": "O2 sat if mentioned"
                    }},
                    "physical_exam": "Physical examination findings",
                    "diagnostic_tests": "Lab results, imaging, etc."
                }},
                "assessment": {{
                    "primary_diagnosis": "Most likely diagnosis",
                    "differential_diagnoses": ["Alternative diagnoses"],
                    "clinical_impression": "Overall clinical assessment"
                }},
                "plan": {{
                    "treatment": "Treatment plan",
                    "medications": ["Prescribed medications with dosage"],
                    "follow_up": "Follow-up instructions",
                    "patient_education": "Education provided to patient",
                    "additional_testing": "Any additional tests ordered"
                }}
            }}

            Only include information that was actually discussed in the conversation. Use "Not discussed" for missing information.
            """
            
            response = self.client.chat.completions.create(
                model=settings.GPT_MODEL,
                messages=[
                    {"role": "system", "content": "You are a medical AI assistant specialized in creating SOAP notes. You must respond with ONLY valid JSON, no additional text or formatting."},
                    {"role": "user", "content": prompt + "\n\nIMPORTANT: Return ONLY the JSON object, no markdown formatting or additional text."}
                ],
                temperature=0.1
            )
            
            soap_text = response.choices[0].message.content
            
            # Clean up common formatting issues
            if soap_text.startswith('```json'):
                soap_text = soap_text.replace('```json', '').replace('```', '').strip()
            elif soap_text.startswith('```'):
                soap_text = soap_text.replace('```', '').strip()
            
            # Try to parse as JSON, fallback to structured text if parsing fails
            try:
                soap_note = json.loads(soap_text)
            except json.JSONDecodeError as e:
                print(f"JSON parsing error: {e}")
                print(f"Raw response: {soap_text[:200]}...")
                soap_note = {
                    "raw_response": soap_text,
                    "parsing_error": f"Could not parse as JSON: {str(e)}"
                }
            
            return soap_note
            
        except Exception as e:
            print(f"Error generating SOAP note: {e}")
            return {"error": str(e)}
    
    async def generate_patient_summary(self, transcript: str) -> str:
        """
        Generate plain English patient summary
        
        Args:
            transcript: Raw conversation transcript
            
        Returns:
            Patient-friendly summary text
        """
        try:
            prompt = f"""
            You are a medical AI assistant. Create a clear, patient-friendly summary of the following doctor-patient conversation.

            Transcript:
            {transcript}

            Write a summary that:
            1. Uses simple, non-medical language
            2. Explains what was discussed
            3. Lists any diagnoses in understandable terms
            4. Includes treatment recommendations
            5. Mentions follow-up instructions
            6. Is reassuring and informative

            Keep it concise but comprehensive. This will be shared with the patient via QR code.
            """
            
            response = self.client.chat.completions.create(
                model=settings.GPT_MODEL,
                messages=[
                    {"role": "system", "content": "You are a medical AI assistant that creates patient-friendly summaries."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            print(f"Error generating patient summary: {e}")
            return f"Error generating summary: {str(e)}"
    
    async def check_compliance(self, soap_note: Dict) -> Dict:
        """
        Check SOAP note for missing required information and compliance issues
        
        Args:
            soap_note: Generated SOAP note dictionary
            
        Returns:
            Compliance report with missing items and suggestions
        """
        try:
            soap_json = json.dumps(soap_note, indent=2)
            
            prompt = f"""
            You are a medical compliance AI assistant. Review the following SOAP note and identify missing required information or compliance issues.

            SOAP Note:
            {soap_json}

            Check for:
            1. Missing vital signs (especially if physical exam was performed)
            2. Missing allergy information
            3. Missing medication reconciliation
            4. Incomplete assessment or plan
            5. Missing follow-up instructions
            6. Incomplete documentation of symptoms
            7. Missing patient education documentation

            Return a JSON response with:
            {{
                "compliance_score": 85,
                "missing_items": [
                    {{
                        "category": "Vital Signs",
                        "item": "Blood pressure not recorded",
                        "severity": "high",
                        "suggestion": "Blood pressure should be recorded for all patient visits"
                    }}
                ],
                "recommendations": [
                    "Consider documenting patient education provided",
                    "Ensure all allergies are documented"
                ],
                "overall_assessment": "Good documentation with minor gaps"
            }}
            """
            
            response = self.client.chat.completions.create(
                model=settings.GPT_MODEL,
                messages=[
                    {"role": "system", "content": "You are a medical compliance AI assistant. You must respond with ONLY valid JSON, no additional text or formatting."},
                    {"role": "user", "content": prompt + "\n\nIMPORTANT: Return ONLY the JSON object, no markdown formatting or additional text."}
                ],
                temperature=0.1
            )
            
            compliance_text = response.choices[0].message.content
            
            # Clean up common formatting issues
            if compliance_text.startswith('```json'):
                compliance_text = compliance_text.replace('```json', '').replace('```', '').strip()
            elif compliance_text.startswith('```'):
                compliance_text = compliance_text.replace('```', '').strip()
            
            # Try to parse as JSON
            try:
                compliance_report = json.loads(compliance_text)
            except json.JSONDecodeError as e:
                print(f"Compliance JSON parsing error: {e}")
                print(f"Raw response: {compliance_text[:200]}...")
                compliance_report = {
                    "compliance_score": 0,
                    "missing_items": [],
                    "recommendations": ["Error parsing compliance check"],
                    "overall_assessment": "Compliance check failed",
                    "raw_response": compliance_text
                }
            
            return compliance_report
            
        except Exception as e:
            print(f"Error checking compliance: {e}")
            return {
                "compliance_score": 0,
                "missing_items": [],
                "recommendations": [],
                "overall_assessment": f"Compliance check error: {str(e)}",
                "error": str(e)
            }
    
    async def edit_summary_with_prompt(self, current_summary: str, edit_prompt: str) -> str:
        """
        Edit patient summary based on doctor's prompt
        
        Args:
            current_summary: Current patient summary
            edit_prompt: Doctor's editing instructions
            
        Returns:
            Updated summary
        """
        try:
            prompt = f"""
            You are a medical AI assistant. Edit the following patient summary based on the doctor's instructions.

            Current Summary:
            {current_summary}

            Doctor's Edit Instructions:
            {edit_prompt}

            Provide the updated summary that incorporates the requested changes while maintaining a patient-friendly tone.
            """
            
            response = self.client.chat.completions.create(
                model=settings.GPT_MODEL,
                messages=[
                    {"role": "system", "content": "You are a medical AI assistant that edits patient summaries."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.2
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            print(f"Error editing summary: {e}")
            return current_summary  # Return original if edit fails
