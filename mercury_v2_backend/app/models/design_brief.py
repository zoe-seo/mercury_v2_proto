from sqlalchemy import Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy import ForeignKey
from datetime import datetime
import uuid
from app.core.database import Base

class DesignBrief(Base):
    """Design brief model for storing structured design requirements."""
    __tablename__ = "design_briefs"
    
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        primary_key=True, 
        default=uuid.uuid4
    )
    chat_session_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("chat_sessions.id"),
        unique=True,
        nullable=True,
        index=True
    )
    canvas_project_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("canvas_projects.id"),
        unique=True,
        nullable=True,
        index=True
    )
    concept_info: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    shoe_spec: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    marketing_context: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    
    created_at: Mapped[datetime] = mapped_column(
        default=datetime.utcnow, 
        nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        default=datetime.utcnow, 
        onupdate=datetime.utcnow, 
        nullable=False
    )

    # Relationships
    chat_session = relationship("ChatSession", back_populates="design_brief")
    canvas_project = relationship("CanvasProject", back_populates="design_brief")
