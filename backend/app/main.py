"""
VERITAS - AI-Based Social Media Identity Risk Assessment Platform
Main FastAPI Application
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import load_backend_env

load_backend_env()

from app.routes import router
from app.database import init_db

init_db()
# Initialize FastAPI app
app = FastAPI(
    title="VERITAS API",
    description="AI-powered social media identity risk assessment and scam detection",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS middleware to allow frontend connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (can be restricted to specific domains)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(router)


@app.get("/")
async def root():
    """Root endpoint"""
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
            "deception_graph": "GET /api/deception-graph"
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
