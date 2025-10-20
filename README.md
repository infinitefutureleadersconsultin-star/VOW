# VOW Theory - Daily Remembrance Platform

A transformative web application that helps users remember their authentic selves through daily vows, reflections, and AI-powered insights.

## 🌟 Overview

VOW Theory is built on the **Law of Daily Remembrance™**: transformation happens through consistency, not intensity. Every day you remember who you are, you strengthen the neural pathways of authenticity.

### The Three Principles

1. **The Pacification Paradox™** - Accept without fighting
2. **The Confrontational Model™** - Face the truth with compassion  
3. **The Integration Cycle™** - Become whole again

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ 
- Firebase account
- OpenAI API key (optional, for AI features)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/vow-theory.git
cd vow-theory
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
- Firebase configuration
- JWT secret
- OpenAI API key (optional)

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure
```
vow-theory/
├── pages/              # Next.js pages & API routes
│   ├── api/           # Backend API endpoints
│   ├── index.js       # Landing page
│   ├── dashboard.js   # Main dashboard
│   ├── vow.js         # Vow management
│   ├── reflection.js  # Daily reflections
│   └── learn/         # Educational content
├── components/        # React components
│   ├── Layout.js      # App shell
│   ├── charts/        # Data visualizations
│   ├── cards/         # Principle cards
│   └── ...
├── lib/               # Core business logic
│   ├── firebase.js    # Firebase config
│   ├── openai.js      # AI integration
│   ├── storage.js     # Local storage
│   ├── patterns.js    # Pattern analysis
│   └── ...
├── utils/             # Utility functions
│   ├── dateUtils.js   # Date helpers
│   └── validation.js  # Form validation
├── styles/            # Global styles
│   └── globals.css    # Tailwind + custom CSS
└── public/            # Static assets
```

## 🔑 Key Features

### Core Functionality
- ✅ User authentication (signup/login)
- ✅ Daily vow creation and tracking
- ✅ Reflection journaling with stages
- ✅ Trigger logging and analysis
- ✅ Streak tracking and recovery
- ✅ Progress dashboard

### AI Features (Optional)
- 🤖 AI-powered vow insights
- 🤖 Reflection analysis
- 🤖 Pattern recognition
- 🤖 Weekly summaries

### User Experience
- 📱 Responsive mobile design
- 🎨 Beautiful, calming interface
- 📊 Visual progress tracking
- 🏆 Achievement system
- 📈 Analytics and insights

## 🔧 Configuration

### Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Firestore Database
3. Enable Authentication (Email/Password)
4. Copy your config to `.env.local`

### OpenAI Setup (Optional)

1. Get API key from [platform.openai.com](https://platform.openai.com)
2. Add to `.env.local` as `OPENAI_API_KEY`
3. AI features will gracefully degrade if not configured

## 📚 API Endpoints

### Authentication
- `POST /api/signup` - Create new account
- `POST /api/login` - User login

### User Data
- `GET /api/userData` - Get user profile and stats
- `PUT /api/updateUser` - Update user information
- `DELETE /api/deleteAccount` - Delete account

### Vows
- `POST /api/createVow` - Create new vow
- `GET /api/vow` - Get vow details
- `PUT /api/vow` - Update vow
- `DELETE /api/vow` - Delete vow
- `POST /api/completeDay` - Mark day complete

### Reflections
- `POST /api/reflection` - Create reflection
- `GET /api/reflections` - Get user reflections

### AI Features
- `POST /api/vowReflect` - Get AI insights

### Export
- `POST /api/export` - Export user data (JSON/CSV/TXT)

## 🎨 Styling

VOW Theory uses **Tailwind CSS** with custom color scheme:
```css
/* Brand Colors */
Awareness (Gold): #C6A664
Observation (Teal): #5FD3A5
Separation (Orange): #B7791F
Pacification (Green): #90EE90
```

Custom CSS classes:
- `.awareness-text` - Gold text for key concepts
- `.observation-text` - Gray text for descriptions
- `.separation-card` - White card with shadow

## 🧪 Testing
```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project to Vercel
3. Add environment variables
4. Deploy

### Other Platforms

Works with any Node.js hosting:
- Netlify
- Railway
- Render
- AWS Amplify

## 📖 Documentation

### Core Concepts

**Vow**: A daily commitment statement (e.g., "Today I am authentic")

**Reflection**: Daily journal entry in one of three stages:
- Pacification (observation)
- Confrontation (understanding)
- Integration (wholeness)

**Trigger**: External event that activates old patterns

**Streak**: Consecutive days of practice

**Alignment Index**: Overall progress metric (0-100%)

### Data Model
```javascript
// User
{
  userId: string,
  email: string,
  firstName: string,
  lastName: string,
  tier: 'trial' | 'seeker' | 'master',
  stats: {
    currentStreak: number,
    longestStreak: number,
    totalVows: number,
    completedVows: number,
    totalReflections: number
  },
  createdAt: timestamp
}

// Vow
{
  vowId: string,
  userId: string,
  statement: string,
  category: string,
  duration: number,
  currentDay: number,
  status: 'active' | 'completed' | 'abandoned',
  createdAt: timestamp,
  completedDays: string[]
}

// Reflection
{
  reflectionId: string,
  userId: string,
  vowId?: string,
  text: string,
  stage: 'pacification' | 'confrontation' | 'integration',
  emotion?: string,
  createdAt: timestamp
}
```

## 🔐 Security

- JWT authentication with secure tokens
- Password hashing (handled by Firebase)
- HTTPS required in production
- Environment variables for secrets
- Input validation on all forms
- SQL injection prevention
- XSS protection

## 🤝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

Copyright © 2025 VOW Theory. All rights reserved.

## 📞 Support

- Email: support@vowtheory.com
- Documentation: docs.vowtheory.com
- Issues: GitHub Issues

## 🙏 Acknowledgments

Built with:
- Next.js - React framework
- Firebase - Backend & auth
- Tailwind CSS - Styling
- OpenAI - AI features
- Vercel - Hosting

## 🗺️ Roadmap

### Phase 1 (Current)
- ✅ Core vow and reflection system
- ✅ User authentication
- ✅ Basic AI insights
- ✅ Progress tracking

### Phase 2 (Coming Soon)
- 🔄 Mobile apps (iOS/Android)
- 🔄 Community features
- 🔄 Advanced analytics
- 🔄 Guided programs

### Phase 3 (Future)
- 📅 Group challenges
- 📅 Therapist integration
- 📅 API for third-party apps
- 📅 Multi-language support

## 💡 Philosophy

VOW Theory is based on the principle that **you are not broken—you adapted**. Through daily remembrance, you can:

1. **See** patterns without judgment (Pacification)
2. **Understand** where they came from (Confrontation)  
3. **Integrate** both selves into wholeness (Integration)

Every day of practice matters. Consistency creates change.

---

**Remember**: You were whole before. You are becoming whole again.

📿 **VOW Theory** - Daily Remembrance Creates Change
