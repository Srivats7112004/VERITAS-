# VERITAS - Because Appearances Deceive

<p align="center">
  <strong>AI-Based Social Media Identity Risk Assessment & Scam Awareness Platform</strong>
</p>

---

## 🎯 Overview

VERITAS is a sophisticated cybersecurity-inspired web application that analyzes suspicious social media identities, detects scam patterns, identifies impersonation attempts, and educates users through interactive simulations. The platform combines rule-based AI logic, lightweight NLP analysis, explainable risk scoring, and an immersive user interface.

## ✨ Key Features

### 🔍 Identity Risk Analyzer
- Real-time risk assessment for social media profiles
- Analyzes profile data, messages, and behavioral patterns
- Generates risk scores (0-100) with explainable reasoning
- Categorizes risk levels: Low, Medium, High

### 👥 Twin Detection Engine
- Detects impersonation and duplicate accounts
- Identifies suspicious username patterns
- Calculates similarity scores between accounts
- Highlights deceptive clues

### 🎮 Social Engineering Simulation Lab
- Interactive training scenarios with real scam examples
- Three response options: Trust, Verify, Ignore
- Immediate feedback with manipulation tactic explanations
- Helps users build scam awareness

### 📊 Intelligence Dashboard
- Real-time analytics and statistics
- Risk distribution charts
- Scam trend analysis
- Detection performance metrics

### 🕸️ Deception Graph
- Visual network of fraudulent connections
- Maps fake identities, scam schemes, and relationships
- Interactive node exploration
- Severity-based visualization

### 🏗️ System Architecture
- Explainable AI reasoning visualization
- Detection factor breakdown
- Technology stack overview

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ (for frontend)
- Python 3.8+ (for backend)
- npm or yarn

### Installation

#### 1. Clone/Navigate to Project
```bash
cd "VERITAS PROJECT"
```

#### 2. Backend Setup
```bash
cd backend
pip install -r requirements.txt
python main.py
```
Backend runs on: `http://localhost:8000`

#### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on: `http://localhost:5173`

### 4. Access the Application
Open your browser and navigate to: `http://localhost:5173`

## 📁 Project Structure

```
VERITAS PROJECT/
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   ├── pages/               # Page components
│   │   ├── utils/               # Utilities (API client)
│   │   ├── App.jsx              # Main app component
│   │   └── index.css            # Global styles
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app
│   │   ├── routes.py            # API endpoints
│   │   ├── services.py          # Analysis logic
│   │   └── models.py            # Data models
│   ├── main.py                  # Entry point
│   ├── requirements.txt
│   └── README.md
│
└── README.md (this file)
```

## 🎨 Design & Styling

### Color Palette
- **Primary Background**: Deep Navy (#0A192F), Matte Black (#111827)
- **Accent Colors**: Neon Cyan (#22D3EE), Electric Blue (#3B82F6), Purple (#7C3AED)
- **Text**: White (#FFFFFF), Soft Gray (#B0BEC5)

### Visual Features
- Glassmorphism cards with blur effects
- Animated gradient glows
- Smooth transitions and hover interactions
- Cyber particles/grid background
- Animated risk indicators
- Premium neon highlights

## 🧠 How Analysis Works

### Risk Scoring System
The platform evaluates multiple factors:

**Message Analysis (0-40 points)**
- Urgency phrases ("act now", "limited time")
- Unrealistic promises ("double your money")
- Authority claims ("official", "support")
- Call-to-action requests
- Suspicious links
- Crypto/investment keywords

**Profile Analysis (0-30 points)**
- Account age and activity
- Follower count patterns
- Bio content analysis
- Username characteristics

**Engagement Ratio (0-20 points)**
- Follower/following balance
- Bot-like behavior detection

**Impersonation Indicators (0-10 points)**
- Username similarity scoring
- Pattern matching with known fakes

**Result: 0-100 Risk Score**
- 0-30: Low Risk ✓
- 31-60: Medium Risk ⚠️
- 61-100: High Risk 🚨

## 💻 Technology Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Recharts** - Data visualization
- **Lucide Icons** - Icon library

### Backend
- **FastAPI** - Modern Python web framework
- **Python 3.8+** - Runtime
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server

## 📖 API Documentation

Full API documentation available at: `http://localhost:8000/docs` (Swagger UI)

### Key Endpoints

**POST /api/analyze**
```json
{
  "username": "@user",
  "followers": 150,
  "following": 200,
  "bio": "Cryptocurrency expert",
  "message": "Send 1 Bitcoin, I'll double it!"
}
```

**POST /api/twin-detection**
```json
{
  "legitimate_username": "@official_account",
  "suspicious_username": "@official_account_"
}
```

**GET /api/simulations**
Returns list of training scenarios

**GET /api/dashboard/stats**
Returns analytics data

**GET /api/deception-graph**
Returns network visualization data

## 🎓 Educational Features

### Simulation Lab Scenarios
1. **Crypto Doubling Scam** - Financial fraud detection
2. **Fake Instagram Support** - Impersonation awareness
3. **Fake Job Recruiter** - Employment scam education

Each scenario teaches:
- How scammers manipulate victims
- Warning signs to watch for
- Correct response strategies

## 🔒 Security Considerations

- Input validation with Pydantic models
- CORS enabled for frontend integration
- No storage of sensitive user data
- Client-side risk assessment
- Explainable AI for transparency

## 📊 Example Analysis

**Input:**
- Username: `@crypto_support_official`
- Followers: 45
- Following: 8000
- Bio: "Official support team"
- Message: "Your account needs verification. Click here immediately or lose access!"

**Analysis Result:**
```
Risk Score: 78/100 (HIGH)

Risk Factors:
- Urgency phrases detected (immediately, lose access)
- Authority impersonation (official support)
- Suspicious follower/following ratio (45:8000)
- New/inactive account pattern
- Call-to-action with link

Recommendation: DO NOT engage. Block immediately and report.
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy 'dist' folder
```

### Backend (Heroku/Railway)
```bash
# Create Procfile
echo "web: uvicorn app.main:app --host 0.0.0.0 --port $PORT" > Procfile

# Deploy
```

## 📝 Future Enhancements

- [ ] Machine learning models for advanced pattern recognition
- [ ] Multi-language support
- [ ] Browser extension
- [ ] Mobile app (React Native)
- [ ] Integration with social media APIs
- [ ] User authentication and profiles
- [ ] Database for analysis history
- [ ] Real-time threat feeds

## 🤝 Contributing

Contributions welcome! Please follow:
1. Code style consistency
2. Add tests for new features
3. Update documentation
4. Submit pull requests

## 📄 License

MIT License - Feel free to use for educational projects

## 👨‍💼 Project Information

**Type**: B.Tech Final/Mini Project  
**Category**: Cybersecurity, AI/ML, Web Application  
**Difficulty**: Beginner-Friendly Backend, Advanced UI

Perfect for:
- Final year computer science projects
- Hackathons
- Portfolio projects
- Educational demonstrations

## 📞 Support

### Backend Issues
- Check `backend/README.md` for backend-specific help
- Verify Python version and dependencies
- Check if port 8000 is available

### Frontend Issues
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf .vite`
- Check Node version compatibility

### General Help
- Check logs in terminal
- Review API responses in browser console
- Visit `/api/health` endpoint to verify backend is running

---

<p align="center">
  <strong>VERITAS - Because Appearances Deceive</strong>
  <br>
  <em>Protect yourself from digital deception with AI-powered intelligence</em>
</p>
