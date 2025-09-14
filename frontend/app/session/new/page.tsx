"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Stethoscope, ArrowLeft, User, UserCheck } from "lucide-react";
import Link from "next/link";

export default function NewSession() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    doctorName: "",
    patientName: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.doctorName.trim() || !formData.patientName.trim()) {
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/sessions/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          doctor_name: formData.doctorName,
          patient_name: formData.patientName,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/session/${data.session_id}`);
      } else {
        console.error("Failed to create session");
      }
    } catch (error) {
      console.error("Error creating session:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-dm-sans">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-purple-800/10"></div>
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `
          linear-gradient(30deg, rgba(147, 51, 234, 0.1) 1px, transparent 1px),
          linear-gradient(150deg, rgba(147, 51, 234, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px'
      }}></div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-gray-800/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2">
              <Stethoscope className="w-8 h-8 text-purple-500" />
              <span className="text-2xl font-black text-white tracking-tight">skribe</span>
            </Link>
            
            <Link href="/dashboard">
              <Button variant="ghost" className="text-gray-300 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold gradient-text-light mb-4">
            Start New Session
          </h1>
          <p className="text-gray-400 text-lg">
            Begin a new medical consultation with AI-powered documentation
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-dark rounded-2xl p-8 shadow-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Doctor Name Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-purple-400" />
                Doctor Name
              </label>
              <input
                type="text"
                value={formData.doctorName}
                onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-colors"
                placeholder="Enter doctor's name"
                required
              />
            </div>

            {/* Patient Name Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <User className="w-4 h-4 text-purple-400" />
                Patient Name
              </label>
              <input
                type="text"
                value={formData.patientName}
                onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-colors"
                placeholder="Enter patient's name"
                required
              />
            </div>

            {/* Privacy Notice */}
            <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
              <p className="text-sm text-purple-200">
                <span className="font-semibold">Privacy Notice:</span> All medical conversations are processed securely and in compliance with HIPAA regulations. Audio data is encrypted and processed only for transcription purposes.
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading || !formData.doctorName.trim() || !formData.patientName.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creating Session...
                </div>
              ) : (
                "Start Medical Session"
              )}
            </Button>
          </form>

        
        </motion.div>
      </div>
    </div>
  );
}
