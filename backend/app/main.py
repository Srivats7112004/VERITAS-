"""
VERITAS - AI-Based Social Media Identity Risk Assessment Platform
Main FastAPI Application
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import load_backend_env
from app.database import init_db
from app.routes import router


load_backend_env()
init_db()

app = FastAPI(
    title="VERITAS API",
    description="AI-powered social media identity risk assessment and scam detection",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.get("/")
async def root():
    return {
        "message": "VERITAS API - Because Appearances Deceive",
        "version": "1.0.0",
        "endpoints": {
            "docs": "/docs",
            "health": "/api/health",
            "analyze": "POST /api/analyze",
            "twin_detection": "POST /api/twin-detection",
            "simulations": "GET /api/simulations",
            "dashboard": "GET /api/dashboard/stats",
            "deception_graph": "GET /api/deception-graph",
        },
    }