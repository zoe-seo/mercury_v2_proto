from datetime import datetime
from uuid import UUID
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

# Concept Info
class ConceptInfoBase(BaseModel):
    theme: Optional[str] = Field(None, example="Minimalist Runner")
    target_audience: Optional[Dict[str, Any]] = Field(None, example={"gender": "unisex", "age_group": "20s"})
    overall_tone: Optional[str] = Field(None, example="Clean, Modern")

# Shoe Spec
class ShoeSpecBase(BaseModel):
    category: Optional[str] = Field(None, example="Running")
    upper_material: Optional[str] = Field(None, example="Mesh")
    sole_type: Optional[str] = Field(None, example="Chunky")
    key_colors: Optional[List[str]] = Field(None, example=["#000000", "#FFFFFF"])

# Marketing Context
class MarketingContextBase(BaseModel):
    season: Optional[str] = Field(None, example="2024 SS")
    price_point: Optional[str] = Field(None, example="Mid")
    competitors: Optional[List[str]] = Field(None, example=["Nike Pegasus"])

# Design Brief Base
class DesignBriefBase(BaseModel):
    concept_info: Optional[ConceptInfoBase] = None
    shoe_spec: Optional[ShoeSpecBase] = None
    marketing_context: Optional[MarketingContextBase] = None
    reference_image_url: Optional[str] = Field(None, example="https://mercury-assets.../ref.png")

class DesignBriefCreate(DesignBriefBase):
    pass

class DesignBriefUpdate(DesignBriefBase):
    pass

class DesignBriefResponse(DesignBriefBase):
    id: UUID
    chat_session_id: Optional[UUID] = None
    canvas_project_id: Optional[UUID] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class DesignBriefSync(BaseModel):
    source_chat_session_id: UUID
