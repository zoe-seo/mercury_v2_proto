from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.core.logging import setup_logging
import logging

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events."""
    # Startup
    setup_logging()
    logger.info("Application starting up...")
    
    yield
    
    # Shutdown
    logger.info("Application shutting down...")
