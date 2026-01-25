from typing import List, Optional
from pydantic import BaseModel
from .design_brief import DesignBriefBase

class GalleryItem(BaseModel):
    id: str
    image_url: str
    title: str
    brief_data: DesignBriefBase

class GalleryResponse(BaseModel):
    items: List[GalleryItem]
    total: int
