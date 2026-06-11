# 🚀 VERITAS - Quick Start Guide

## Installation & Setup

### ⚙️ Prerequisites
Before starting, ensure you have:
- **Node.js** 16+ ([Download](https://nodejs.org/))
- **Python** 3.8+ ([Download](https://www.python.org/))
- **npm** or **yarn** (comes with Node.js)
- **Git** (optional, for cloning)

### 📋 System Requirements
- RAM: 4GB minimum
- Disk Space: 1GB
- Modern web browser (Chrome, Firefox, Edge, Safari)

---

## 🎯 Step-by-Step Installation

### Step 1: Backend Setup

#### 1a. Navigate to backend folder
```bash
cd "VERITAS PROJECT/backend"
```

#### 1b. Create virtual environment (recommended)
**On Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**On macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

#### 1c. Install dependencies
```bash
pip install -r requirements.txt
```

This installs:
- FastAPI
- Uvicorn (ASGI server)
- Pydantic (data validation)
- Python-multipart
- CORS support

#### 1d. Start backend server
```bash
python main.py
```

✅ **Expected output:**
```
🚀 Starting VERITAS API Server...
📊 Swagger UI: http://localhost:8000/docs
📚 ReDoc: http://localhost:8000/redoc
INFO:     Uvicorn running on http://0.0.0.0:8000
```

✨ **Backend is now running!**

---

### Step 2: Frontend Setup

#### 2a. Navigate to frontend folder
```bash
cd "VERITAS PROJECT/frontend"
```

#### 2b. Install Node dependencies
```bash
npm install
```

This installs:
- React
- Vite
- Tailwind CSS
- Framer Motion
- Recharts
- Lucide Icons
- Axios
- And more...

**Wait time**: 2-5 minutes depending on internet speed

#### 2c. Start development server
```bash
npm run dev
```

✅ **Expected output:**
```
VITE v4.4.11  ready in 1234 ms
➜ Local:   http://localhost:5173/
➜ press h to show help
```

✨ **Frontend is now running!**

---

## 🌐 Access the Application

1. **Open your browser**
2. **Navigate to**: `http://localhost:5173`
3. **Enjoy VERITAS!** 🎉

### Browser Console
Open Developer Tools (F12) to see:
- API requests/responses
- Console logs
- Network activity

---

## 📚 API Documentation

While the app is running, access interactive API docs:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

These documents show all endpoints, request/response schemas, and let you test APIs directly.

---

## 🎮 Using VERITAS

### Landing Page
- Overview of features
- Navigation to all sections

### Identity Risk Analyzer
1. Enter a social media username
2. Add follower/following counts
3. Paste account bio (optional)
4. Paste a suspicious message
5. Click "Analyze Profile"
6. Get instant risk assessment with recommendations

**Example Test Data:**
```
Username: @crypto_expert_official
Followers: 50
Following: 5000
Bio: Official Crypto Support Team
Message: Send 1 BTC now! I'll double it. Limited offer 24 hours only!
```
Expected: High Risk (78+)

### Twin Detection
1. Enter legitimate username
2. Enter suspicious username
3. Click "Compare & Detect"
4. Get impersonation analysis

**Example:**
```
Legitimate: @instagram_official
Suspicious: @instagram_official_
```

### Simulation Lab
1. Choose a scenario
2. Read the scam attempt
3. Select response: Trust / Verify / Ignore
4. Get instant feedback
5. Learn manipulation tactics

### Deception Graph
- Click nodes to see details
- View network of fraud connections
- Analyze threat severity

### Dashboard
- View analytics
- Track detection trends
- See scam statistics

---

## 🛠️ Troubleshooting

### Backend Issues

**Port 8000 already in use:**
```bash
# On Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# On macOS/Linux
lsof -i :8000
kill -9 <PID>
```

**Python not found:**
- Ensure Python is installed: `python --version`
- Add Python to PATH
- Use `python3` if `python` doesn't work

**Dependencies error:**
```bash
# Clear and reinstall
pip cache purge
pip install -r requirements.txt
```

### Frontend Issues

**Port 5173 already in use:**
```bash
# Vite will automatically try another port
# Or kill the process using port 5173
```

**Node modules issues:**
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**Styles not loading:**
```bash
# Clear Vite cache
rm -rf .vite
npm run dev
```

**API not responding:**
- Verify backend is running on http://localhost:8000
- Check `/api/health` endpoint
- View browser console for errors
- Check CORS settings in `app/main.py`

---

## 📦 Build for Production

### Frontend Build
```bash
npm run build
```
Creates optimized `dist/` folder for deployment

### Backend Deployment
See `backend/README.md` for deployment instructions

---

## 🔧 Environment Configuration

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000/api
```

### Backend (automatic)
- Host: 0.0.0.0
- Port: 8000
- Reload: Enabled (auto-restart on changes)

---

## 📝 Project Structure

```
VERITAS PROJECT/
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── pages/             # Page components
│   │   ├── utils/             # API client
│   │   ├── assets/            # Images, fonts
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── routes.py
│   │   ├── services.py
│   │   └── models.py
│   ├── main.py
│   ├── requirements.txt
│   └── README.md
│
├── README.md
├── SETUP.md (this file)
└── .gitignore
```

---

## 🚀 Development Workflow

### Making Changes

**Frontend:**
1. Edit files in `src/`
2. Changes auto-reload (Vite HMR)
3. Check browser for updates

**Backend:**
1. Edit files in `app/`
2. Server auto-reloads
3. Test at http://localhost:8000/docs

### Testing

**Frontend:**
- Open Chrome DevTools (F12)
- Check Console for errors
- Test API responses in Network tab

**Backend:**
- Visit http://localhost:8000/docs
- Use Swagger UI to test endpoints
- Check terminal output for logs

---

## 📊 Performance Tips

1. **Close unnecessary applications** to free up RAM
2. **Use modern browser** for better performance
3. **Clear browser cache** if experiencing issues
4. **Monitor system resources** while running both servers

---

## 🆘 Getting Help

### Verify Setup
```bash
# Check backend
curl http://localhost:8000/api/health

# Should return:
# {"status": "healthy", "service": "VERITAS API"}
```

### Common Solutions
1. **Restart both servers**: Stop (Ctrl+C) and restart
2. **Clear caches**: Delete `node_modules`, `.vite`, `__pycache__`
3. **Check ports**: Ensure 8000 and 5173 are free
4. **Update dependencies**: `pip install --upgrade -r requirements.txt`

### Debug Mode
Set environment variables:
```bash
# Backend
set PYTHONUNBUFFERED=1

# Frontend (Vite)
set DEBUG=*
```

---

## 📚 Next Steps

1. ✅ Complete the setup above
2. 🎮 Test all features in the application
3. 📖 Read backend/README.md for API details
4. 🎨 Customize styling in `tailwind.config.js`
5. 🧠 Modify detection logic in `backend/app/services.py`
6. 🚀 Deploy to production when ready

---

## 📞 Support Resources

- **Frontend**: React, Vite, Tailwind docs
- **Backend**: FastAPI documentation
- **Styling**: Tailwind CSS docs
- **Animations**: Framer Motion docs
- **Charts**: Recharts documentation

---

## 🎉 You're All Set!

VERITAS is now ready to use. Visit **http://localhost:5173** and start analyzing!

**Remember**: VERITAS - Because Appearances Deceive! 🛡️

---

Last Updated: 2026-05-11
