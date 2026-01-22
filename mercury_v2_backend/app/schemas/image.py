from pydantic import BaseModel, ConfigDict
from datetime import datetime
import uuid
from typing import Any


class GeneratedImageResponse(BaseModel):
    """Schema for generated image response."""
    id: uuid.UUID
    session_id: uuid.UUID | None
    canvas_project_id: uuid.UUID | None
    image_url: str
    thumbnail_url: str | None
    prompt: str
    generation_params: dict[str, Any] | None
    image_type: str
    created_at: datetime
    is_selected: bool
    
    model_config = ConfigDict(from_attributes=True)


class GeneratedImageListResponse(BaseModel):
    """Schema for generated image list response."""
    images: list[GeneratedImageResponse]
    total: int


class TaskStatusResponse(BaseModel):
    """Schema for Celery task status response."""
    task_id: str
    status: str
    result: Any | None = None
    progress: dict[str, Any] | None = None
