import pytest
import pytest_asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.pool import NullPool
from httpx import AsyncClient, ASGITransport

from app.core.database import Base
from app.main import app
from app.deps.db import get_db

# Test database URL
TEST_DATABASE_URL = "postgresql+asyncpg://postgres:postgres@localhost:5433/mercury_v2_test"


@pytest_asyncio.fixture(scope="function")
async def test_db():
    """Create a test database session."""
    # Create test engine
    engine = create_async_engine(
        TEST_DATABASE_URL,
        poolclass=NullPool,
    )
    
    # Create all tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    
    # Create session factory
    async_session = async_sessionmaker(
        engine,
        class_=AsyncSession,
        expire_on_commit=False,
    )
    
    async with async_session() as session:
        yield session
    
    # Cleanup
    await engine.dispose()


@pytest_asyncio.fixture(scope="function")
async def client(test_db):
    """Create a test client with database override."""
    async def override_get_db():
        yield test_db
    
    app.dependency_overrides[get_db] = override_get_db
    
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        yield ac
    
    app.dependency_overrides.clear()


@pytest_asyncio.fixture(scope="function")
async def auth_headers(client):
    """Create authenticated user and return auth headers."""
    # Create a test user
    response = await client.post(
        "/api/v1/auth/signup",
        json={
            "email": "testuser@example.com",
            "password": "testpassword123",
            "name": "Test User"
        }
    )
    
    # Extract token from response
    data = response.json()
    if "data" in data:
        token = data["data"]["access_token"]
    else:
        token = data["access_token"]
    
    return {"Authorization": f"Bearer {token}"}
