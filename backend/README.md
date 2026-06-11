# VERITAS Backend

Backend API for the VERITAS identity risk assessment platform. Built with FastAPI.

## Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Run the Server
```bash
python main.py
```

The server will start on http://localhost:8000

### 3. Access API Documentation
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

### Analysis
- **POST /api/analyze** - Analyze identity for risk assessment
- **POST /api/twin-detection** - Detect impersonation attempts

### Simulations
- **GET /api/simulations** - Get all simulation scenarios
- **POST /api/simulations/{id}/response** - Submit simulation response

### Analytics
- **GET /api/dashboard/stats** - Get dashboard statistics
- **GET /api/deception-graph** - Get network graph data

### Health
- **GET /api/health** - Health check
- **GET /** - API information

## Project Structure

```
backend/
├── app/
│   ├── main.py           # FastAPI app initialization
│   ├── routes.py         # API routes/endpoints
│   ├── services.py       # Business logic & AI analysis
│   └── models.py         # Pydantic data models
├── main.py               # Entry point for running server
├── requirements.txt      # Python dependencies
└── README.md
```

## How Analysis Works

### Hybrid Scoring Algorithm
The system now uses a local synthetic Instagram scam dataset first, then optionally asks Groq for reasoning.

1. **Local Dataset Scorer**
   - Username scam structures
   - Bio keyword red flags
   - Message pattern signatures
   - Follower/following ratio thresholds
   - Scam type classification signals

2. **Optional Groq LLM Reasoning**
   - Set `GROQ_API_KEY` in your backend environment to enable it
   - Defaults to `llama-3.3-70b-versatile`
   - Override with `GROQ_MODEL` if needed
   - If Groq is unavailable or no key is set, VERITAS automatically uses local-only scoring

3. **Combined Trust Score**
   - Local dataset score carries most of the weight
   - Groq adds explanation and a bounded score adjustment
   - The API response shape stays the same for the frontend

### Risk Categories
- **Low Risk** (0-30): Safe account
- **Medium Risk** (31-60): Caution recommended
- **High Risk** (61-100): Likely scam/fraud

## Extending the System

### Add New Scam Patterns
Edit `app/data/instagram_scam_patterns.json`

### Tune Scoring Logic
Modify `AnalysisService` in `app/services.py`

### Add Simulation Scenarios
Update `SIMULATION_SCENARIOS` in `app/routes.py`

## Notes

- The backend works locally with no external API calls required
- Groq is optional and only used when `GROQ_API_KEY` is configured
- CORS is enabled for frontend integration
- API documentation is auto-generated with FastAPI
