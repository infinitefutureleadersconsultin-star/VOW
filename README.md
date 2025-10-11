# VOW - Law of Daily Remembrance

> "Remember who you said you'd be."

A revolutionary app that transforms healing from warfare to remembrance. Built on the VOW Theory by Issiah Deon McLean, this app helps users honor personal vows through daily conscious awareness, not combat.

---

## 🧠 What is VOW?

VOW operationalizes the **Law of Daily Remembrance**: healing is not a battle against addiction, procrastination, or unhealthy habits—it is the restoration of identity through daily, conscious remembrance of a personal vow.

### The Vow Formula
This simple structure anchors users to their identity and commitment, transforming behavior through observation and awareness rather than resistance.

---

## ✨ Core Features

### 🎯 Vow Management
- Create personal vows using the proper structure
- Dual identity view: "Who I Was" ↔ "Who I Am Becoming"
- AI-powered analysis detects combat language and suggests reframing
- Daily remembrance prompts and audio playback

### 📊 Trigger Logging & Analytics
- Log urges with emotions, intensity, location, and optional voice notes
- Pattern detection identifies high-risk times and common triggers
- Anticipatory notifications: gentle reminders before vulnerable moments
- Resistance rate tracking celebrates awareness over perfection

### 🧩 Memory Linking & Trauma Detection
- Connect current triggers to past memories
- Automatic detection of 20+ trauma markers
- Professional support referrals when needed (SAMHSA, Crisis Text Line)
- Pattern analysis reveals emotional themes and timeframes

### 💳 Progressive Pricing & Trial Psychology
- **2-Day "Opening Vow" Trial** (not called "trial" in UX)
- **Progressive pricing**: $4.99 → $9.99 → $14.99 based on stage
- Stripe integration with completion bias messaging
- Trial countdown as "Days of Becoming"

### 🔔 Anticipatory Notifications
- Time-based alerts: "You tend to notice urges around 9pm..."
- Compassionate check-ins after slip-ups
- Milestone celebrations (Promise Seals)
- No shaming, only supportive guidance

### 🌐 Progressive Web App (PWA)
- Installable on mobile and desktop
- Offline caching for core features
- Push notifications with interactive actions
- Background sync for trigger logs

---

## 🏗️ Tech Stack

### Frontend
- **Next.js 13+** - React framework with server-side rendering
- **React 18** - UI components with hooks
- **Tailwind CSS** - Utility-first styling
- **TypeScript** - Type safety (optional, configured)

### Backend
- **Next.js API Routes** - Serverless functions on Vercel
- **Firebase Auth** - User authentication
- **Firestore** - Real-time database
- **Stripe** - Payment processing

### Infrastructure
- **Vercel** - Hosting and deployment
- **Service Worker** - PWA features and push notifications
- **Zod** - Schema validation

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Firebase account
- Stripe account
- Vercel account (for deployment)

### Installation
```bash
# 1. Clone or create project directory
mkdir vow-app && cd vow-app

# 2. Install dependencies
npm install

# 3. Copy environment variables
cp .env.example .env.local

# 4. Add your credentials to .env.local
# - Firebase config
# - Stripe keys
# - JWT secret

# 5. Run development server
npm run dev

# 6. Open browser
# Navigate to http://localhost:3000
