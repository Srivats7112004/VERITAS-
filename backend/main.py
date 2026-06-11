"""
Main entry point for running the VERITAS backend server.

Local run:
python main.py

Production run:
uvicorn main:app --host 0.0.0.0 --port $PORT
"""

import os
import sys

import uvicorn

# Add backend directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.config import load_backend_env

load_backend_env()

# Important: expose FastAPI app for Uvicorn/Render
from app.main import app


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))

    print("🚀 Starting VERITAS API Server...")
    print(f"📊 Swagger UI: http://localhost:{port}/docs")
    print(f"📚 ReDoc: http://localhost:{port}/redoc")

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=True,
        log_level="info",
    )