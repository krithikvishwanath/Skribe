"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Stethoscope } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen text-white font-dm-sans relative overflow-hidden">
      {/* Black background base */}
      <div className="absolute inset-0 bg-black"></div>
      
      {/* Purple to white gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-purple-600/80 via-purple-400/20 to-transparent"></div>
      
      {/* Isometric grid pattern */}
      <div 
        className="absolute inset-0 opacity-30" 
        style={{
          backgroundImage: `
            linear-gradient(30deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(150deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px, 40px 40px, 20px 20px'
        }}
      ></div>
      
      {/* Animated particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-0.5 h-0.5 bg-white/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className="relative z-10 p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-8 h-8 text-white" />
            <span className="text-2xl font-black text-white tracking-tight">skribe</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" className="text-gray-200 hover:text-white border border-gray-600/30 hover:border-gray-400/50 font-semibold tracking-wide">
                Dashboard
              </Button>
            </Link>
            <Link href="/session/new">
              <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold tracking-wide">
                Start Session
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content - Centered */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-1">
        <div className="text-center max-w-4xl mx-auto mb-50">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {/* Main heading with white text for dark background */}
            <h1 className="text-4xl lg:text-7xl font-light mb-6 leading-tight">
              <span className="block font-bold tracking-tighter text-white drop-shadow-lg">Smart Ambient</span>
              <span className="lg:text-6xl block tracking-tighter text-gray-300 font-small">
                Healthcare Dictation
              </span>
            </h1>
            
            <motion.p 
              className="text-lg lg:text-xl text-gray-300 mb-10 leading-relaxed max-w-2xl mx-auto drop-shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              Transform patient conversations into structured clinical notes with AI-powered 
              transcription and real-time compliance monitoring.
            </motion.p>
            
           
            
            {/* CTA Button with glow */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link href="/session/new">
                <Button 
                  size="lg" 
                  className="relative bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 hover:from-purple-700 hover:via-purple-800 hover:to-purple-900 text-white border-0 px-10 py-4 text-base font-medium rounded-md shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <span className="relative z-10">Get Started</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-purple-500/20 to-purple-600/20 rounded-full blur-lg opacity-50 -z-10"></div>
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}