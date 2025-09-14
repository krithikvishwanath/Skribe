# Skribe Frontend - Next.js Medical Transcription Interface

Modern, responsive frontend for Skribe's Smart Ambient Healthcare Dictation system. Built with Next.js 14, React, TypeScript, and Tailwind CSS featuring a beautiful dark purple theme.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Backend server running on port 8000

### Installation

1. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

2. **Environment setup**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your backend URL
   ```

3. **Run development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

The frontend will be available at http://localhost:3000

## 🎨 Design System

### Dark Purple Theme
The application features a sophisticated dark purple theme with:
- **Primary Colors**: Purple gradients (#9333EA to #7C3AED)
- **Background**: Black base with purple overlays
- **Accents**: Green (success), Yellow (warnings), Red (errors), Blue (info)
- **Typography**: DM Sans font family
- **Glass Morphism**: Backdrop blur effects with subtle borders

### Color Palette
```css
/* Primary Purple Gradients */
from-purple-600 to-purple-700    /* Buttons, CTAs */
from-purple-900/20 via-black     /* Background overlays */
text-purple-400                  /* Accent text */
border-purple-500/30             /* Subtle borders */

/* Status Colors */
text-green-400                   /* Success states */
text-yellow-400                  /* Warnings */
text-red-400                     /* Errors */
text-blue-400                    /* Information */

/* Glass Effects */
bg-gray-900/40 backdrop-blur-2xl /* Glass morphism */
border-gray-700/30               /* Glass borders */
```

## 🏗️ Architecture

```
app/
├── (pages)/
│   ├── page.tsx              # Landing page
│   ├── dashboard/            # Main dashboard
│   ├── session/
│   │   ├── new/             # New session creation
│   │   └── [id]/            # Session details & transcription
│   └── patient/[id]/        # Patient summary view (QR access)
├── globals.css              # Global styles & theme
└── layout.tsx               # Root layout

components/
└── ui/
    ├── button.tsx           # Reusable button component
    └── ...                  # Additional UI components

lib/
└── utils.ts                 # Utility functions
```

## 📱 Pages & Features

### Landing Page (`/`)
- **Hero Section**: Animated landing with product overview
- **Dark Theme**: Consistent with provided design
- **Call-to-Action**: Direct navigation to dashboard/new session
- **Responsive Design**: Mobile-first approach

### Dashboard (`/dashboard`)
- **Session Overview**: List of all medical sessions
- **Statistics Cards**: Total sessions, completed notes, pending reviews
- **Search & Filter**: Find sessions by patient/doctor name
- **Status Indicators**: Visual progress tracking
- **Real-time Updates**: Live session status updates

### New Session (`/session/new`)
- **Form Interface**: Doctor and patient name input
- **Privacy Notice**: HIPAA compliance information
- **Feature Preview**: Highlight of session capabilities
- **Validation**: Form validation and error handling

### Session Details (`/session/[id]`)
- **Real-time Transcription**: Live audio-to-text conversion
- **Tabbed Interface**: Transcript, SOAP Note, Summary, Compliance
- **Recording Controls**: Start/stop audio recording
- **AI Processing**: Generate SOAP notes and summaries
- **QR Code Generation**: Patient summary sharing
- **Summary Editing**: AI-powered summary refinement

### Patient Summary (`/patient/[id]`)
- **Public Access**: QR code accessible patient summary
- **Clean Design**: Patient-friendly interface
- **Download Option**: Save summary as text file
- **Mobile Optimized**: Touch-friendly design

## 🔌 API Integration

### REST API Calls
```typescript
// Create new session
const response = await fetch(`${API_URL}/api/v1/sessions/`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({ doctor_name, patient_name })
});

// Get session data
const session = await fetch(`${API_URL}/api/v1/sessions/${sessionId}`);

// Edit patient summary
const editResponse = await fetch(`${API_URL}/api/v1/sessions/${sessionId}/edit-summary`, {
  method: 'POST',
  body: new URLSearchParams({ edit_prompt })
});
```

### WebSocket Integration
```typescript
// Initialize WebSocket connection
const ws = new WebSocket(`${WS_URL}/ws/transcription`);

// Send audio chunk for transcription
ws.send(JSON.stringify({
  type: "audio_chunk",
  data: base64AudioData,
  timestamp: new Date().toISOString()
}));

// Handle incoming messages
ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  switch (message.type) {
    case "transcript_chunk":
      updateTranscript(message.data);
      break;
    case "soap_generated":
      setSoapNote(message.data);
      break;
    // ... handle other message types
  }
};
```

## 🎤 Audio Recording

### MediaRecorder Integration
```typescript
// Start recording
const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
const mediaRecorder = new MediaRecorder(stream);

mediaRecorder.ondataavailable = (event) => {
  // Convert to base64 and send to backend
  const reader = new FileReader();
  reader.onload = () => {
    const base64Audio = reader.result.split(',')[1];
    websocket.send(JSON.stringify({
      type: "audio_chunk",
      data: base64Audio
    }));
  };
  reader.readAsDataURL(event.data);
};

mediaRecorder.start(1000); // Collect data every second
```

## 🎯 Component Structure

### Reusable Components
- **Button**: Styled button with variants (primary, secondary, ghost, outline)
- **Glass Cards**: Backdrop blur containers with subtle borders
- **Status Indicators**: Visual status representations
- **Loading States**: Animated loading spinners and skeletons

### Page-Specific Components
- **Recording Controls**: Start/stop recording interface
- **Transcript Display**: Real-time transcript updates
- **SOAP Note Viewer**: Structured medical note display
- **QR Code Generator**: Patient summary sharing
- **Compliance Dashboard**: Missing information alerts

## 🌐 Responsive Design

### Breakpoints
```css
/* Mobile First */
sm: 640px    /* Small devices */
md: 768px    /* Medium devices */
lg: 1024px   /* Large devices */
xl: 1280px   /* Extra large devices */
2xl: 1536px  /* 2X large devices */
```

### Mobile Optimizations
- **Touch-friendly buttons**: Minimum 44px touch targets
- **Readable typography**: Appropriate font sizes for mobile
- **Simplified navigation**: Collapsible menus and streamlined UI
- **Performance**: Optimized images and lazy loading

## 🎨 Animations & Interactions

### Framer Motion Animations
```typescript
// Fade in animation
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>

// Stagger animations for lists
<motion.div
  variants={{
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }}
>
  {items.map((item, index) => (
    <motion.div
      key={item.id}
      variants={{
        hidden: { opacity: 0, x: -20 },
        show: { opacity: 1, x: 0 }
      }}
    >
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

### CSS Animations
- **Pulse effects**: Recording indicators
- **Gradient animations**: Button hover effects
- **Smooth transitions**: All interactive elements
- **Loading spinners**: Custom animated loading states

## 🔧 Development Tools

### TypeScript Configuration
- **Strict mode**: Full type checking enabled
- **Path mapping**: Clean import paths with `@/` prefix
- **Type definitions**: Comprehensive type coverage

### Tailwind CSS
- **Custom theme**: Extended color palette and animations
- **Utility classes**: Consistent spacing and typography
- **Dark mode**: Built-in dark theme support
- **Responsive utilities**: Mobile-first responsive design

### Next.js Features
- **App Router**: Latest Next.js routing system
- **Server Components**: Optimized rendering
- **Image Optimization**: Automatic image optimization
- **API Routes**: Proxy to backend API

## 📱 Progressive Web App

### PWA Features (Future Enhancement)
- **Service Worker**: Offline functionality
- **App Manifest**: Installable web app
- **Push Notifications**: Real-time updates
- **Background Sync**: Offline data synchronization

## 🧪 Testing Strategy

### Recommended Testing Stack
```bash
# Install testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom jest
```

### Test Categories
- **Unit Tests**: Individual component testing
- **Integration Tests**: Component interaction testing
- **E2E Tests**: Full user journey testing
- **Accessibility Tests**: WCAG compliance testing

## 🚀 Deployment

### Build for Production
```bash
# Build the application
npm run build

# Start production server
npm start
```

### Environment Variables
```bash
# .env.local
NEXT_PUBLIC_API_URL=https://your-backend-api.com
NEXT_PUBLIC_WS_URL=wss://your-websocket-endpoint.com
```

### Deployment Platforms
- **Vercel**: Seamless Next.js deployment
- **Netlify**: JAMstack deployment
- **AWS Amplify**: Full-stack deployment
- **Docker**: Containerized deployment

## 🎯 Performance Optimization

### Core Web Vitals
- **LCP**: Optimized with Next.js Image component
- **FID**: Minimal JavaScript bundle size
- **CLS**: Stable layout with proper sizing

### Optimization Techniques
- **Code Splitting**: Route-based splitting
- **Image Optimization**: WebP format with fallbacks
- **Font Loading**: Optimized Google Fonts loading
- **Bundle Analysis**: Regular bundle size monitoring

## 🔒 Security Best Practices

### Client-Side Security
- **XSS Prevention**: Sanitized user inputs
- **HTTPS Only**: Secure communication
- **CSP Headers**: Content Security Policy
- **Environment Variables**: Secure API key handling

## 📚 Browser Compatibility

### Supported Browsers
- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

### Polyfills
- **MediaRecorder API**: For older browsers
- **WebSocket**: Fallback for limited support
- **CSS Grid**: Flexbox fallbacks where needed
