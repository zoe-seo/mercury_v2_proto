from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime
from typing import Optional
import uuid


# Design Package Creation
class DesignPackageCreate(BaseModel):
    """Schema for creating a design package."""
    source_type: str = Field(..., pattern="^(chat|canvas)$")
    source_id: uuid.UUID
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    selected_image_ids: list[uuid.UUID]
    context: Optional[dict] = None


class DesignPackageUpdate(BaseModel):
    """Schema for updating a design package."""
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None


# Design Package Response
class DesignImageResponse(BaseModel):
    """Schema for design image response."""
    id: uuid.UUID
    image_type: str
    image_url: str
    thumbnail_url: Optional[str]
    display_order: int
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


class MarketReportResponse(BaseModel):
    """Schema for market report response."""
    id: uuid.UUID
    market_analysis: Optional[str]
    cost_analysis: Optional[str]
    trend_data: Optional[dict]
    competitor_data: Optional[dict]
    chart_data: Optional[dict]
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


class DesignPackageListItem(BaseModel):
    """Schema for design package list item."""
    id: uuid.UUID
    title: str
    description: Optional[str]
    project_id: Optional[uuid.UUID]
    color_palette: Optional[dict]
    created_at: datetime
    updated_at: datetime
    status: str
    
    model_config = ConfigDict(from_attributes=True)


class DesignPackageDetailResponse(BaseModel):
    """Schema for detailed design package response."""
    id: uuid.UUID
    title: str
    description: Optional[str]
    project_id: Optional[uuid.UUID]
    status: str
    package_metadata: Optional[dict]
    color_palette: Optional[dict]
    images: list[DesignImageResponse]
    market_report: Optional[MarketReportResponse]
    created_at: datetime
    updated_at: datetime


class DesignPackageCreateResponse(BaseModel):
    """Schema for design package creation response."""
    design_package_id: uuid.UUID
    status: str
    message: str
    estimated_time: str


# Export and Sharing
class PDFExportRequest(BaseModel):
    """Schema for PDF export request."""
    include_report: bool = True
    include_charts: bool = True


class PDFExportResponse(BaseModel):
    """Schema for PDF export response."""
    download_url: str
    expires_at: datetime


class ShareLinkRequest(BaseModel):
    """Schema for share link creation request."""
    expires_in_days: int = Field(default=30, ge=1, le=365)


class ShareLinkResponse(BaseModel):
    """Schema for share link response."""
    share_url: str
    share_token: str
    expires_at: datetime


# Production Assets
class ProductionGenerationParams(BaseModel):
    """Schema for production generation parameters."""
    model: Optional[str] = "imagen-3.0"
    quality: Optional[str] = "high"
    format: Optional[str] = None


class Production2DRequest(BaseModel):
    """Schema for 2D production request."""
    generation_params: Optional[ProductionGenerationParams] = None


class Production3DRequest(BaseModel):
    """Schema for 3D production request."""
    generation_params: Optional[ProductionGenerationParams] = None


class ProductionAssetStatus(BaseModel):
    """Schema for production asset status."""
    type: str
    status: str
    asset_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    retry_count: int = 0
    progress: Optional[int] = None
    error_message: Optional[str] = None


class Production2DResponse(BaseModel):
    """Schema for 2D production start response."""
    task_id: str
    status: str
    assets: list[dict]


class Production3DResponse(BaseModel):
    """Schema for 3D production start response."""
    task_id: str
    status: str
    estimated_time: str


class ProductionStatusResponse(BaseModel):
    """Schema for production status response."""
    package_status: str
    assets: list[ProductionAssetStatus]


class ProductionRetryRequest(BaseModel):
    """Schema for production retry request."""
    asset_type: str


class ProductionRetryResponse(BaseModel):
    """Schema for production retry response."""
    asset_id: uuid.UUID
    status: str
    retry_count: int


class FinalizeResponse(BaseModel):
    """Schema for package finalization response."""
    package_id: uuid.UUID
    status: str
    message: str
