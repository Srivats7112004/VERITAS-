"""
Main entry point for running the VERITAS backend server
Run with: python main.py
"""

import uvicorn
import sys
import os

# Add app directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.config import load_backend_env

load_backend_env()

if __name__ == "__main__":
    print("🚀 Starting VERITAS API Server...")
    print("📊 Swagger UI: http://localhost:8000/docs")
    print("📚 ReDoc: http://localhost:8000/redoc")
    
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
