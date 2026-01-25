from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime
from typing import Optional
import uuid


# Canvas Project Schemas
class CanvasProjectCreate(BaseModel):
    """Schema for creating a canvas project."""
    name: str = Field(..., min_length=1, max_length=200)
    project_id: Optional[uuid.UUID] = None


class CanvasProjectUpdate(BaseModel):
    """Schema for updating canvas state."""
    canvas_state: Optional[dict] = None


class CanvasProjectResponse(BaseModel):
    """Schema for canvas project response."""
    id: uuid.UUID
    name: str
    project_id: Optional[uuid.UUID]
    canvas_state: Optional[dict]
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


# Canvas Layer Schemas
class CanvasLayerCreate(BaseModel):
    """Schema for creating a canvas layer."""
    layer_type: str = Field(..., min_length=1, max_length=50)
    layer_data: dict
    z_index: int
    is_visible: bool = True
    is_locked: bool = False
    opacity: float = Field(default=1.0, ge=0.0, le=1.0)


class CanvasLayerUpdate(BaseModel):
    """Schema for updating a canvas layer."""
    layer_data: Optional[dict] = None
    is_visible: Optional[bool] = None
    is_locked: Optional[bool] = None
    opacity: Optional[float] = Field(None, ge=0.0, le=1.0)


class CanvasLayerResponse(BaseModel):
    """Schema for canvas layer response."""
    id: uuid.UUID
    layer_type: str
    layer_data: dict
    z_index: int
    is_visible: bool
    is_locked: bool
    opacity: float
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


class CanvasProjectDetailResponse(BaseModel):
    """Schema for detailed canvas project response with layers."""
    id: uuid.UUID
    name: str
    project_id: Optional[uuid.UUID]
    canvas_state: Optional[dict]
    layers: list[CanvasLayerResponse]
    created_at: datetime
    updated_at: datetime


# Segmentation Schemas
class SegmentData(BaseModel):
    """Schema for a single segment."""
    id: str
    label: str
    mask_data: dict
    color: str


class SegmentationRequest(BaseModel):
    """Schema for segmentation request."""
    layer_id: uuid.UUID


class SegmentationResponse(BaseModel):
    """Schema for segmentation response."""
    segments: list[SegmentData]


# Generation Schemas
class GenerationParams(BaseModel):
    """Schema for generation parameters."""
    strength: Optional[float] = Field(None, ge=0.0, le=1.0)
    steps: Optional[int] = Field(None, ge=1, le=150)
    guidance_scale: Optional[float] = Field(None, ge=0.0, le=20.0)


class SketchToImageRequest(BaseModel):
    """Schema for sketch-to-image generation request."""
    layer_ids: list[uuid.UUID]
    prompt: str
    generation_params: Optional[GenerationParams] = None


class InpaintingRequest(BaseModel):
    """Schema for inpainting request."""
    layer_id: uuid.UUID
    mask_data: dict
    prompt: str
    generation_params: Optional[GenerationParams] = None


class TaskResponse(BaseModel):
    """Schema for async task response."""
    task_id: str
    status: str
