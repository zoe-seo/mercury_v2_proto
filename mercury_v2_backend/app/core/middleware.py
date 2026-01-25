from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from app.core.config import get_settings

settings = get_settings()


def setup_middleware(app: FastAPI):
    """Configure application middleware."""
    
    import logging
    logger = logging.getLogger(__name__)
    logger.info(f"🌐 CORS Origins: {settings.CORS_ORIGINS}")
    
    # CORS - 개발 환경에서는 모든 localhost 포트 허용
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_origin_regex=r"http://localhost:\d+",  # 모든 localhost 포트 허용
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
        expose_headers=["*"],  # SSE를 위해 추가
    )
    
    logger.info("✅ CORS middleware configured")
    
    # Trusted hosts (uncomment in production)
    # app.add_middleware(
    #     TrustedHostMiddleware,
    #     allowed_hosts=["yourdomain.com", "*.yourdomain.com"]
    # )
