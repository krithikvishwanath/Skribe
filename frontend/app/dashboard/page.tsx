"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Stethoscope, 
  Plus, 
  FileText, 
  Clock, 
  Users, 
  Activity,
  CheckCircle,
  AlertTriangle,
  Search
} from "lucide-react";
import Link from "next/link";

interface Session {
  session_id: string;
  doctor_name: string;
  patient_name: string;
  created_at: string;
  has_transcript: boolean;
  has_soap_note: boolean;
  has_summary: boolean;
}

export default function Dashboard() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/sessions/`);
      if (response.ok) {
        const data = await response.json();
        setSessions(data);
      }
    } catch (error) {
      console.error("Error fetching sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSessions = sessions.filter(session => 
    session.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.doctor_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    totalSessions: sessions.length,
    completedNotes: sessions.filter(s => s.has_soap_note).length,
    pendingReviews: sessions.filter(s => s.has_transcript && !s.has_soap_note).length,
    activeToday: sessions.filter(s => {
      const today = new Date().toDateString();
      return new Date(s.created_at).toDateString() === today;
    }).length
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
            
            <div className="flex items-center gap-4">
              <Link href="/session/new">
                <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold">
                  <Plus className="w-4 h-4 mr-2" />
                  New Session
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold gradient-text-light mb-2">
            Healthcare Dashboard
          </h1>
          <p className="text-gray-400 text-lg">
            Manage your medical sessions and clinical documentation
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="glass-dark rounded-xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Total Sessions</p>
                <p className="text-3xl font-bold text-white">{stats.totalSessions}</p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </div>

          <div className="glass-dark rounded-xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Completed Notes</p>
                <p className="text-3xl font-bold text-white">{stats.completedNotes}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="glass-dark rounded-xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Pending Reviews</p>
                <p className="text-3xl font-bold text-white">{stats.pendingReviews}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
            </div>
          </div>

          <div className="glass-dark rounded-xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Active Today</p>
                <p className="text-3xl font-bold text-white">{stats.activeToday}</p>
              </div>
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search patients or doctors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
              />
            </div>
          </div>
        </motion.div>

        {/* Sessions List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-dark rounded-xl shadow-xl overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-700/50">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-500" />
              Recent Sessions
            </h2>
          </div>

          <div className="divide-y divide-gray-700/50">
            {loading ? (
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                <p className="mt-2 text-gray-400">Loading sessions...</p>
              </div>
            ) : filteredSessions.length === 0 ? (
              <div className="p-8 text-center">
                <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">
                  {sessions.length === 0 ? "No sessions yet" : "No sessions match your search"}
                </p>
                <Link href="/session/new">
                  <Button className="bg-gradient-to-r from-purple-600 to-purple-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Start Your First Session
                  </Button>
                </Link>
              </div>
            ) : (
              filteredSessions.map((session, index) => (
                <motion.div
                  key={session.session_id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-6 hover:bg-gray-800/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="text-lg font-semibold text-white">
                          {session.patient_name}
                        </h3>
                        <span className="text-gray-400 text-sm">
                          with Dr. {session.doctor_name}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(session.created_at).toLocaleDateString()} at{" "}
                          {new Date(session.created_at).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                          session.has_transcript 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-gray-600/20 text-gray-500'
                        }`}>
                          <div className={`w-2 h-2 rounded-full ${
                            session.has_transcript ? 'bg-green-500' : 'bg-gray-500'
                          }`}></div>
                          Transcript
                        </div>

                        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                          session.has_soap_note 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-gray-600/20 text-gray-500'
                        }`}>
                          <div className={`w-2 h-2 rounded-full ${
                            session.has_soap_note ? 'bg-green-500' : 'bg-gray-500'
                          }`}></div>
                          SOAP Note
                        </div>

                        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                          session.has_summary 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-gray-600/20 text-gray-500'
                        }`}>
                          <div className={`w-2 h-2 rounded-full ${
                            session.has_summary ? 'bg-green-500' : 'bg-gray-500'
                          }`}></div>
                          Summary
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link href={`/session/${session.session_id}`}>
                        <Button 
                          variant="ghost" 
                          className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
                        >
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
