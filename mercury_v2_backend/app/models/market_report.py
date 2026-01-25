from sqlalchemy import Text
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID, JSONB
from datetime import datetime
import uuid
from app.core.database import Base


class MarketReport(Base):
    """Market report model for design package market analysis."""
    __tablename__ = "market_reports"
    
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        primary_key=True, 
        default=uuid.uuid4
    )
    design_package_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        nullable=False,
        index=True
    )
    market_analysis: Mapped[str | None] = mapped_column(Text, nullable=True)
    cost_analysis: Mapped[str | None] = mapped_column(Text, nullable=True)
    trend_data: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    competitor_data: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    chart_data: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        default=datetime.utcnow, 
        nullable=False
    )
