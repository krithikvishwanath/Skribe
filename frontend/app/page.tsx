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
            
            {/* Sleek Dashboard Mockup */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="mt-12"
            >
              <div className="relative max-w-7xl mx-auto">
                <div className="relative bg-gray-900/40 backdrop-blur-2xl rounded-3xl border border-gray-700/30 shadow-2xl overflow-hidden">
                  {/* Elegant Header */}
                  <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-xl px-8 py-4 border-b border-gray-700/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-8">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <span className="text-white text-lg font-bold">S</span>
                          </div>
                          <div>
                            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                              Healthcare Dictation
                            </h1>
                            <p className="text-xs text-gray-400">AI-Powered Clinical Documentation</p>
                          </div>
                        </div>
                        <nav className="hidden md:flex items-center gap-6">
                          <span className="text-purple-400 font-medium border-b-2 border-purple-400 pb-1">Dashboard</span>
                          <span className="text-gray-400 hover:text-white transition-colors cursor-pointer">Sessions</span>
                          <span className="text-gray-400 hover:text-white transition-colors cursor-pointer">Analytics</span>
                          <span className="text-gray-400 hover:text-white transition-colors cursor-pointer">Settings</span>
                        </nav>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-gray-800/50 rounded-full px-4 py-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-xs text-green-400 font-medium">Online</span>
                        </div>
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center border border-purple-500/30">
                          <span className="text-sm text-purple-300 font-medium">DC</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Elegant Glow Effect */}
                  <div className="absolute -inset-6 bg-gradient-to-r from-purple-600/5 via-purple-500/10 to-pink-600/5 rounded-3xl blur-2xl -z-10"></div>
                  <div className="absolute -inset-12 bg-gradient-to-r from-purple-600/3 via-transparent to-purple-600/3 rounded-3xl blur-3xl -z-20"></div>
                </div>
              </div>
            </motion.div>
            
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