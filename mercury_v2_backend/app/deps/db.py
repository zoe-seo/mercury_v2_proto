from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import AsyncSessionLocal


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """FastAPI dependency for database sessions.
    
    Sessions are yielded to route handlers.
    Transaction management (commit/rollback) is handled explicitly in the service layer.
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
