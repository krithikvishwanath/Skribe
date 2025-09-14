import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Skribe - Smart Ambient Healthcare Dictation',
  description: 'Transform patient conversations into structured clinical notes with AI-powered transcription and real-time compliance monitoring.',
  keywords: 'healthcare, dictation, AI, medical notes, SOAP, transcription',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-black text-white`}>
        {children}
      </body>
    </html>
  )
}
