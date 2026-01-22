from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime
import uuid
from app.schemas.pagination import PaginationMeta


class ProjectBase(BaseModel):
    """Base project schema."""
    name: str = Field(..., min_length=1, max_length=200)
    description: str | None = None


class ProjectCreate(ProjectBase):
    """Schema for creating a project."""
    pass


class ProjectUpdate(BaseModel):
    """Schema for updating a project."""
    name: str | None = Field(None, min_length=1, max_length=200)
    description: str | None = None


class ProjectResponse(ProjectBase):
    """Schema for project response."""
    id: uuid.UUID
    user_id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


class ProjectListResponse(BaseModel):
    """Schema for project list response with pagination."""
    items: list[ProjectResponse]
    pagination: PaginationMeta
