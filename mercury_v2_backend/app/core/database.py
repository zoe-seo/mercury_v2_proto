from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from app.core.config import get_settings

settings = get_settings()

# Async engine
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    future=True,
    pool_pre_ping=True,      # 연결 사용 전 ping으로 유효성 검사
    pool_recycle=3600,       # 1시간마다 연결 재생성
    pool_size=5,             # 기본 연결 풀 크기
    max_overflow=10,         # 추가 연결 최대 개수
    pool_timeout=30,         # 연결 대기 타임아웃
)

# Session factory
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

# Alias for Celery tasks compatibility
async_session_maker = AsyncSessionLocal


class Base(DeclarativeBase):
    """Base class for all SQLAlchemy models."""
    pass

