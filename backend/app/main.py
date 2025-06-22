from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging
from contextlib import asynccontextmanager

from .database.connection import create_tables
from .api.routes import get_router
from .services.cron_service import cron_service

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting News App API...")
    
    # Create database tables
    create_tables()
    logger.info("Database tables created")
    
    # Start the background scheduler
    cron_service.start_scheduler()
    logger.info("Background scheduler started")
    
    yield
    
    # Shutdown
    logger.info("Stopping News App API...")
    cron_service.stop_scheduler()
    logger.info("Background scheduler stopped")

# Create FastAPI app
app = FastAPI(
    title="News App API",
    description="A Tinder-like news app API with automatic news fetching",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://localhost:3001", 
        "http://localhost:3002", 
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(get_router(), prefix="/api/v1", tags=["news"])

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to News App API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/api/v1/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 