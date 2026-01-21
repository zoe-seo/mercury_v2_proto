from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from app.core.config import get_settings

settings = get_settings()


def setup_middleware(app: FastAPI):
    """Configure application middleware."""
    
    # CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Trusted hosts (uncomment in production)
    # app.add_middleware(
    #     TrustedHostMiddleware,
    #     allowed_hosts=["yourdomain.com", "*.yourdomain.com"]
    # )
