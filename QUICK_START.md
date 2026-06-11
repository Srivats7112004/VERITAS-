# ⚡ VERITAS - Quick Reference

## 🚀 Quick Start (30 seconds)

### Terminal 1 - Backend
```bash
cd "VERITAS PROJECT/backend"
pip install -r requirements.txt
python main.py
```
✅ Backend runs on: **http://localhost:8000**

### Terminal 2 - Frontend
```bash
cd "VERITAS PROJECT/frontend"
npm install
npm run dev
```
✅ Frontend runs on: **http://localhost:5173**

### Open Browser
```
http://localhost:5173
```

---

## 📍 Important URLs

| URL | Purpose |
|-----|---------|
| http://localhost:5173 | VERITAS Application |
| http://localhost:8000 | Backend API |
| http://localhost:8000/docs | API Documentation (Swagger) |
| http://localhost:8000/redoc | API Documentation (ReDoc) |
| http://localhost:8000/api/health | Health Check |

---

## 🧪 Test the Application

### Test Case 1: High-Risk Profile
```
Username: @crypto_expert_official
Followers: 50
Following: 5000
Bio: Official Crypto Support Team
Message: Send 1 BTC now! I'll double it in 24 hours. Limited offer!
```
Expected Result: High Risk (75+)

### Test Case 2: Twin Detection
```
Legitimate: @instagram
Suspicious: @instagram_official
```
Expected Result: Likely Impersonation

### Test Case 3: Simulation
1. Go to Simulation Lab
2. Choose "Crypto Doubling Scam"
3. Select "Ignore"
4. Review feedback

---

## 📂 File Structure

```
VERITAS PROJECT/
├── frontend/                    # React app
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   ├── pages/              # Page components
│   │   ├── utils/              # API client
│   │   └── index.css           # Global styles
│   ├── package.json
│   ├── vite.config.js
│   └── .env
├── backend/                     # FastAPI app
│   ├── app/
│   │   ├── main.py            # FastAPI app
│   │   ├── routes.py          # Endpoints
│   │   ├── services.py        # AI logic
│   │   └── models.py          # Data models
│   ├── main.py                # Entry point
│   └── requirements.txt
├── README.md                   # Full documentation
├── SETUP.md                    # Installation guide
├── COMPONENTS.md              # Component reference
└── PROJECT_SUMMARY.md         # Build summary
```

---

## 🔧 Common Commands

### Frontend
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Backend
```bash
# Install dependencies
pip install -r requirements.txt

# Run server
python main.py

# Run with auto-reload
uvicorn app.main:app --reload
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Port 8000 in use | Kill process: `lsof -i :8000 && kill -9 <PID>` |
| Port 5173 in use | Vite auto-tries different port |
| API not working | Check backend is running: `curl http://localhost:8000/api/health` |
| Blank page | Clear browser cache & check console (F12) |
| Styles not loading | Clear Vite cache: `rm -rf .vite` |
| Node modules error | `rm -rf node_modules && npm install` |
| Python import error | Ensure in correct directory & venv activated |

---

## 🎨 Customization

### Change Colors
Edit `frontend/tailwind.config.js`:
```javascript
colors: {
  'cyber-cyan': '#22D3EE',      // Change here
  'cyber-blue': '#3B82F6',      // And here
  // ...
}
```

### Add Scam Keywords
Edit `backend/app/services.py`:
```python
SCAM_KEYWORDS = {
    'financial_urgency': [
        'urgent', 'limited time',  # Add more here
        // ...
    ]
}
```

### Add Scenarios
Edit `backend/app/routes.py`:
```python
SIMULATION_SCENARIOS = [
    { /* existing */ },
    { /* add new scenario here */ }
]
```

---

## 📊 API Quick Reference

### Analyze Identity
```bash
POST http://localhost:8000/api/analyze
Content-Type: application/json

{
  "username": "@user",
  "followers": 100,
  "following": 200,
  "bio": "User bio",
  "message": "Suspicious message"
}
```

### Detect Twin
```bash
POST http://localhost:8000/api/twin-detection
Content-Type: application/json

{
  "legitimate_username": "@real_account",
  "suspicious_username": "@real_acccount"
}
```

### Get Simulations
```bash
GET http://localhost:8000/api/simulations
```

### Submit Simulation Response
```bash
POST http://localhost:8000/api/simulations/1/response
Content-Type: application/json

{"response": "Ignore"}
```

---

## 📚 Documentation

| File | Purpose |
|------|---------|
| README.md | Main project documentation |
| SETUP.md | Installation & troubleshooting |
| COMPONENTS.md | Frontend component guide |
| PROJECT_SUMMARY.md | Build summary & stats |
| backend/README.md | Backend documentation |

---

## 🎯 Features at a Glance

| Feature | Location | Status |
|---------|----------|--------|
| Landing Page | / | ✅ |
| Risk Analyzer | /analyze | ✅ |
| Twin Detection | /twin-detection | ✅ |
| Simulations | /simulation | ✅ |
| Deception Graph | /deception-graph | ✅ |
| Dashboard | /dashboard | ✅ |
| Architecture | /architecture | ✅ |

---

## 💡 Pro Tips

1. **Use Swagger UI** at `/docs` to test API directly
2. **Open DevTools** (F12) to see API calls
3. **Mobile View** - Press F12 → Toggle device toolbar
4. **Performance** - Use Chrome DevTools for profiling
5. **Git** - Ignore `node_modules` & `__pycache__`

---

## 🚀 Deployment

### Frontend (Vercel)
```bash
npm run build
# Deploy 'dist' folder to Vercel
```

### Backend (Railway/Heroku)
```bash
# Create Procfile:
echo "web: uvicorn app.main:app --host 0.0.0.0 --port $PORT" > Procfile
# Deploy
```

---

## 🆘 Quick Help

**Need help?**
1. Check [SETUP.md](SETUP.md) for detailed troubleshooting
2. Review [COMPONENTS.md](COMPONENTS.md) for code details
3. Visit http://localhost:8000/docs for API docs
4. Check browser console (F12) for errors

---

## ✅ Pre-Launch Checklist

- [ ] Backend installed & running
- [ ] Frontend installed & running
- [ ] Can access http://localhost:5173
- [ ] API docs at http://localhost:8000/docs
- [ ] Navigation works
- [ ] Form submission works
- [ ] Results display correctly

---

## 📝 Notes

- Both servers must be running for full functionality
- Frontend on port **5173**
- Backend on port **8000**
- API requests timeout after 30 seconds
- No database needed (local JSON storage)
- All data processed client-side

---

**Last Updated**: May 11, 2026  
**Status**: ✅ Production Ready  
**Version**: 1.0.0

---

**VERITAS - Because Appearances Deceive** 🛡️
