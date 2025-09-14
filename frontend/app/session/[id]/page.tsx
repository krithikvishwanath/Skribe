"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Stethoscope, 
  Mic, 
  MicOff, 
  Square, 
  FileText, 
  QrCode,
  CheckCircle,
  AlertTriangle,
  User,
  Clock,
  Download,
  Edit3,
  Send
} from "lucide-react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";

interface SessionData {
  session_id: string;
  doctor_name: string;
  patient_name: string;
  transcript: string;
  soap_note: any;
  patient_summary: string;
  compliance_report: any;
  qr_code_url: string;
  created_at: string;
}

export default function SessionPage() {
  const params = useParams();
  const sessionId = params.id as string;
  
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);
  const [activeTab, setActiveTab] = useState("transcript");
  const [editingSummary, setEditingSummary] = useState(false);
  const [summaryEditPrompt, setSummaryEditPrompt] = useState("");
  const [qrCodeData, setQrCodeData] = useState<any>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (sessionId) {
      fetchSessionData();
      initializeWebSocket();
    }
    
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
    };
  }, [sessionId]);

  const fetchSessionData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/sessions/${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        setSessionData(data);
        setCurrentTranscript(data.transcript || "");
      }
    } catch (error) {
      console.error("Error fetching session data:", error);
    }
  };

  const initializeWebSocket = () => {
    const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL}/ws/transcription`;
    wsRef.current = new WebSocket(wsUrl);
    
    wsRef.current.onopen = () => {
      console.log("WebSocket connected");
    };
    
    wsRef.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      
      switch (message.type) {
        case "transcript_complete":
          setCurrentTranscript(message.data);
          setIsProcessing(false);
          // Update session transcript in backend
          updateSessionTranscript(message.data);
          break;
        case "soap_generated":
          setSessionData(prev => prev ? { ...prev, soap_note: message.data } : prev);
          setIsProcessing(false);
          break;
        case "summary_generated":
          setSessionData(prev => prev ? { ...prev, patient_summary: message.data } : prev);
          setIsGeneratingSummary(false);
          break;
        case "compliance_report":
          setSessionData(prev => prev ? { ...prev, compliance_report: message.data } : prev);
          break;
      }
    };
    
    wsRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Process complete recording when stopped
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processCompleteRecording(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    setIsRecording(false);
  };

  const processCompleteRecording = async (audioBlob: Blob) => {
    setIsProcessing(true);
    
    try {
      // Convert blob to base64
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Audio = (reader.result as string).split(',')[1];
        
        // Send complete audio to backend for transcription
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({
            type: "transcribe_complete_audio",
            data: base64Audio,
            session_id: sessionId
          }));
        }
      };
      reader.readAsDataURL(audioBlob);
    } catch (error) {
      console.error("Error processing recording:", error);
      setIsProcessing(false);
    }
  };

  const updateSessionTranscript = async (transcript: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/sessions/${sessionId}/transcript`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          transcript: transcript
        }),
      });
    } catch (error) {
      console.error("Error updating transcript:", error);
    }
  };

  const generateSOAPNote = () => {
    setIsProcessing(true);
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: "generate_soap",
        transcript: currentTranscript,
        session_id: sessionId
      }));
    }
  };

  const generatePatientSummary = () => {
    setIsGeneratingSummary(true);
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: "generate_summary",
        transcript: currentTranscript,
        session_id: sessionId
      }));
    }
  };

  const runComplianceCheck = () => {
    if (sessionData?.soap_note && wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: "compliance_check",
        soap_note: sessionData.soap_note
      }));
    }
  };

  const generateQRCode = async () => {
    setIsGeneratingQR(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/qr/generate/${sessionId}`, {
        method: "POST"
      });
      if (response.ok) {
        const data = await response.json();
        setQrCodeData(data);
      }
    } catch (error) {
      console.error("Error generating QR code:", error);
    } finally {
      setIsGeneratingQR(false);
    }
  };

  const editSummary = async () => {
    if (!summaryEditPrompt.trim()) return;
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/sessions/${sessionId}/edit-summary`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          edit_prompt: summaryEditPrompt
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setSessionData(prev => prev ? { ...prev, patient_summary: data.updated_summary } : prev);
        setEditingSummary(false);
        setSummaryEditPrompt("");
      }
    } catch (error) {
      console.error("Error editing summary:", error);
    }
  };

  if (!sessionData) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-dm-sans">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-purple-800/10"></div>
      
      {/* Navigation */}
      <nav className="relative z-10 border-b border-gray-800/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2">
              <Stethoscope className="w-8 h-8 text-purple-500" />
              <span className="text-2xl font-black text-white tracking-tight">skribe</span>
            </Link>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <User className="w-4 h-4" />
                <span>{sessionData.patient_name}</span>
                <span className="text-gray-600">•</span>
                <span>Dr. {sessionData.doctor_name}</span>
              </div>
              
              <Link href="/dashboard">
                <Button variant="ghost" className="text-gray-300 hover:text-white">
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Session Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Medical Session
              </h1>
              <div className="flex items-center gap-4 text-gray-400">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {new Date(sessionData.created_at).toLocaleString()}
                </div>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                  isRecording 
                    ? 'bg-red-500/20 text-red-400' 
                    : 'bg-gray-600/20 text-gray-400'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-500'
                  }`}></div>
                  {isRecording ? 'Recording' : 'Ready'}
                </div>
              </div>
            </div>
            
            {/* Recording Controls */}
            <div className="flex items-center gap-3">
              {!isRecording ? (
                <Button
                  onClick={startRecording}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
                >
                  <Mic className="w-4 h-4 mr-2" />
                  Start Recording
                </Button>
              ) : (
                <Button
                  onClick={stopRecording}
                  className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white"
                >
                  <Square className="w-4 h-4 mr-2" />
                  Stop Recording
                </Button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex space-x-1 bg-gray-800/50 p-1 rounded-lg">
            {[
              { id: "transcript", label: "Live Transcript", icon: Mic },
              { id: "soap", label: "SOAP Note", icon: FileText },
              { id: "summary", label: "Patient Summary", icon: User },
              { id: "compliance", label: "Compliance", icon: CheckCircle }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-dark rounded-xl shadow-xl overflow-hidden"
        >
          <AnimatePresence mode="wait">
            {activeTab === "transcript" && (
              <motion.div
                key="transcript"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white">Live Transcript</h2>
                  <Button
                    onClick={generateSOAPNote}
                    disabled={!currentTranscript.trim() || isProcessing}
                    className="bg-gradient-to-r from-purple-600 to-purple-700"
                  >
                    {isProcessing ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Processing...
                      </div>
                    ) : (
                      <>
                        <FileText className="w-4 h-4 mr-2" />
                        Generate SOAP Note
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="bg-gray-800/30 rounded-lg p-4 min-h-[400px] max-h-[600px] overflow-y-auto">
                  {currentTranscript ? (
                    <p className="transcript-text whitespace-pre-wrap">
                      {currentTranscript}
                    </p>
                  ) : (
                    <div className="text-center text-gray-500 py-16">
                      <Mic className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Start recording to see live transcription...</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === "soap" && (
              <motion.div
                key="soap"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white">SOAP Note</h2>
                  <div className="flex gap-2">
                    <Button
                      onClick={generatePatientSummary}
                      disabled={!sessionData.soap_note || isGeneratingSummary}
                      variant="outline"
                      className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                    >
                      {isGeneratingSummary ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-400"></div>
                          Generating...
                        </div>
                      ) : (
                        "Generate Summary"
                      )}
                    </Button>
                    <Button
                      onClick={runComplianceCheck}
                      disabled={!sessionData.soap_note}
                      variant="outline"
                      className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10"
                    >
                      Check Compliance
                    </Button>
                  </div>
                </div>
                
                {sessionData.soap_note ? (
                  <div className="space-y-6">
                    {/* Subjective */}
                    {sessionData.soap_note.subjective && (
                      <div className="bg-gray-800/30 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-purple-400 mb-3">SUBJECTIVE</h3>
                        <div className="space-y-2 text-gray-200">
                          {sessionData.soap_note.subjective.chief_complaint && (
                            <p><span className="font-medium text-purple-300">Chief Complaint:</span> {sessionData.soap_note.subjective.chief_complaint}</p>
                          )}
                          {sessionData.soap_note.subjective.history_present_illness && (
                            <p><span className="font-medium text-purple-300">History of Present Illness:</span> {sessionData.soap_note.subjective.history_present_illness}</p>
                          )}
                          {sessionData.soap_note.subjective.past_medical_history && (
                            <p><span className="font-medium text-purple-300">Past Medical History:</span> {sessionData.soap_note.subjective.past_medical_history}</p>
                          )}
                          {sessionData.soap_note.subjective.medications && (
                            <p><span className="font-medium text-purple-300">Medications:</span> {Array.isArray(sessionData.soap_note.subjective.medications) ? sessionData.soap_note.subjective.medications.join(', ') : sessionData.soap_note.subjective.medications}</p>
                          )}
                          {sessionData.soap_note.subjective.allergies && (
                            <p><span className="font-medium text-purple-300">Allergies:</span> {Array.isArray(sessionData.soap_note.subjective.allergies) ? sessionData.soap_note.subjective.allergies.join(', ') : sessionData.soap_note.subjective.allergies}</p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Objective */}
                    {sessionData.soap_note.objective && (
                      <div className="bg-gray-800/30 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-blue-400 mb-3">OBJECTIVE</h3>
                        <div className="space-y-2 text-gray-200">
                          {sessionData.soap_note.objective.vital_signs && (
                            <div>
                              <span className="font-medium text-blue-300">Vital Signs:</span>
                              <div className="ml-4 mt-1">
                                {Object.entries(sessionData.soap_note.objective.vital_signs as Record<string, string>)
                                  .filter(([vital, value]) => value && value !== "Not recorded")
                                  .map(([vital, value]) => (
                                    <p key={vital} className="text-sm">• {vital.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}: {value}</p>
                                  ))}
                              </div>
                            </div>
                          )}
                          {sessionData.soap_note.objective.physical_exam && (
                            <p><span className="font-medium text-blue-300">Physical Exam:</span> {sessionData.soap_note.objective.physical_exam}</p>
                          )}
                          {sessionData.soap_note.objective.diagnostic_tests && (
                            <p><span className="font-medium text-blue-300">Diagnostic Tests:</span> {sessionData.soap_note.objective.diagnostic_tests}</p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Assessment */}
                    {sessionData.soap_note.assessment && (
                      <div className="bg-gray-800/30 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-yellow-400 mb-3">ASSESSMENT</h3>
                        <div className="space-y-2 text-gray-200">
                          {sessionData.soap_note.assessment.primary_diagnosis && (
                            <p><span className="font-medium text-yellow-300">Primary Diagnosis:</span> {sessionData.soap_note.assessment.primary_diagnosis}</p>
                          )}
                          {sessionData.soap_note.assessment.differential_diagnoses && (
                            <p><span className="font-medium text-yellow-300">Differential Diagnoses:</span> {Array.isArray(sessionData.soap_note.assessment.differential_diagnoses) ? sessionData.soap_note.assessment.differential_diagnoses.join(', ') : sessionData.soap_note.assessment.differential_diagnoses}</p>
                          )}
                          {sessionData.soap_note.assessment.clinical_impression && (
                            <p><span className="font-medium text-yellow-300">Clinical Impression:</span> {sessionData.soap_note.assessment.clinical_impression}</p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Plan */}
                    {sessionData.soap_note.plan && (
                      <div className="bg-gray-800/30 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-green-400 mb-3">PLAN</h3>
                        <div className="space-y-2 text-gray-200">
                          {sessionData.soap_note.plan.treatment && (
                            <p><span className="font-medium text-green-300">Treatment:</span> {sessionData.soap_note.plan.treatment}</p>
                          )}
                          {sessionData.soap_note.plan.medications && (
                            <p><span className="font-medium text-green-300">Medications:</span> {Array.isArray(sessionData.soap_note.plan.medications) ? sessionData.soap_note.plan.medications.join(', ') : sessionData.soap_note.plan.medications}</p>
                          )}
                          {sessionData.soap_note.plan.follow_up && (
                            <p><span className="font-medium text-green-300">Follow-up:</span> {sessionData.soap_note.plan.follow_up}</p>
                          )}
                          {sessionData.soap_note.plan.patient_education && (
                            <p><span className="font-medium text-green-300">Patient Education:</span> {sessionData.soap_note.plan.patient_education}</p>
                          )}
                          {sessionData.soap_note.plan.additional_testing && (
                            <p><span className="font-medium text-green-300">Additional Testing:</span> {sessionData.soap_note.plan.additional_testing}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-16">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Generate SOAP note from transcript to view structured clinical documentation</p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "summary" && (
              <motion.div
                key="summary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white">Patient Summary</h2>
                  <div className="flex gap-2">
                    {sessionData.patient_summary && (
                      <>
                        <Button
                          onClick={() => setEditingSummary(!editingSummary)}
                          variant="outline"
                          className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                        >
                          <Edit3 className="w-4 h-4 mr-2" />
                          Edit Summary
                        </Button>
                        <Button
                          onClick={generateQRCode}
                          disabled={isGeneratingQR}
                          className="bg-gradient-to-r from-green-600 to-green-700"
                        >
                          {isGeneratingQR ? (
                            <div className="flex items-center gap-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              Generating...
                            </div>
                          ) : (
                            <>
                              <QrCode className="w-4 h-4 mr-2" />
                              Generate QR Code
                            </>
                          )}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                
                {editingSummary && (
                  <div className="mb-6 bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                    <label className="text-sm font-medium text-blue-300 mb-2 block">
                      Edit Instructions for AI:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={summaryEditPrompt}
                        onChange={(e) => setSummaryEditPrompt(e.target.value)}
                        className="flex-1 px-3 py-2 bg-gray-800/50 border border-gray-600/50 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        placeholder="e.g., 'Make it more reassuring' or 'Add information about follow-up'"
                      />
                      <Button
                        onClick={editSummary}
                        disabled={!summaryEditPrompt.trim()}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-800/30 rounded-lg p-4">
                    {sessionData.patient_summary ? (
                      <div>
                        <h3 className="text-lg font-semibold text-green-400 mb-3">Patient Summary</h3>
                        <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">
                          {sessionData.patient_summary}
                        </p>
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 py-8">
                        <User className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>Generate patient summary from SOAP note</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-gray-800/30 rounded-lg p-4">
                    {qrCodeData ? (
                      <div className="text-center">
                        <h3 className="text-lg font-semibold text-green-400 mb-4">QR Code for Patient</h3>
                        <div className="bg-white p-4 rounded-lg inline-block mb-4">
                          <QRCodeSVG value={qrCodeData.qr_code_url} size={200} />
                        </div>
                        <p className="text-sm text-gray-400">
                          Patient can scan this code to access their summary
                        </p>
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 py-8">
                        <QrCode className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>Generate QR code to share summary with patient</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "compliance" && (
              <motion.div
                key="compliance"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white">Compliance Report</h2>
                </div>
                
                {sessionData.compliance_report ? (
                  <div className="space-y-4">
                    {/* Compliance Score */}
                    <div className="bg-gray-800/30 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-white">Compliance Score</h3>
                        <div className={`text-2xl font-bold ${
                          sessionData.compliance_report.compliance_score >= 80 
                            ? 'text-green-400' 
                            : sessionData.compliance_report.compliance_score >= 60 
                            ? 'text-yellow-400' 
                            : 'text-red-400'
                        }`}>
                          {sessionData.compliance_report.compliance_score}%
                        </div>
                      </div>
                      <p className="text-gray-300">{sessionData.compliance_report.overall_assessment}</p>
                    </div>

                    {/* Missing Items */}
                    {sessionData.compliance_report.missing_items?.length > 0 && (
                      <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-yellow-400 mb-3 flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5" />
                          Missing Information
                        </h3>
                        <div className="space-y-2">
                          {sessionData.compliance_report.missing_items.map((item: any, index: number) => (
                            <div key={index} className="flex items-start gap-3">
                              <div className={`w-2 h-2 rounded-full mt-2 ${
                                item.severity === 'high' ? 'bg-red-500' : 
                                item.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                              }`}></div>
                              <div>
                                <p className="text-white font-medium">{item.item}</p>
                                <p className="text-sm text-gray-400">{item.suggestion}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recommendations */}
                    {sessionData.compliance_report.recommendations?.length > 0 && (
                      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-blue-400 mb-3">Recommendations</h3>
                        <ul className="space-y-1">
                          {sessionData.compliance_report.recommendations.map((rec: string, index: number) => (
                            <li key={index} className="text-gray-300 flex items-start gap-2">
                              <span className="text-blue-400 mt-1">•</span>
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-16">
                    <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Run compliance check on SOAP note to view detailed report</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
