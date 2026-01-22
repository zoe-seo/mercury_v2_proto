from fastapi import FastAPI
from app.core.config import get_settings
from app.core.middleware import setup_middleware
from app.core.lifespan import lifespan
from app.routers import health
from app.routers.v1 import router as v1_router

settings = get_settings()

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    lifespan=lifespan,
)

# Setup middleware
setup_middleware(app)

# Include routers
app.include_router(health.router)
app.include_router(v1_router, prefix="/api")


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": f"Welcome to {settings.APP_NAME}",
        "version": settings.APP_VERSION,
    }
