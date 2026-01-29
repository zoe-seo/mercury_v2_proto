from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime
import uuid
from typing import Any, Literal, Union
from app.schemas.pagination import PaginationMeta


# --- Widget Schemas ---

class WidgetOption(BaseModel):
    id: str
    label: str
    value: str | None = None
    image_url: str | None = None
    is_selected: bool | None = False

class WidgetData(BaseModel):
    options: list[WidgetOption] | None = None
    multi_select: bool | None = False
    palette: list[str] | None = None
    selected_colors: list[str] | None = None
    main_image_url: str | None = None
    variations: list[str] | None = None
    field: str | None = None  # Field name for selection (e.g., "outline_id", "target_user")

class Widget(BaseModel):
    type: Literal['selection_card', 'chip_group', 'color_picker', 'generation_result']
    data: WidgetData


# --- Session Schemas ---

class ChatSessionBase(BaseModel):
    title: str | None = Field(None, max_length=200)

class ChatSessionCreate(BaseModel):
    initial_message: str | None = None
    title: str | None = None
    project_id: uuid.UUID | None = None

class ChatSessionUpdate(BaseModel):
    title: str | None = Field(None, max_length=200)
    brand_identity: dict[str, Any] | None = None
    preferences: dict[str, Any] | None = None
    session_state: str | None = None

class ChatSessionResponse(BaseModel):
    id: uuid.UUID
    title: str
    session_state: str | None = None
    current_step: str | None = 'unknown' # Derived field
    thumbnail_url: str | None = None
    updated_at: datetime
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class ChatSessionListResponse(BaseModel):
    items: list[ChatSessionResponse]
    pagination: PaginationMeta


# --- Message Schemas ---

class ChatMessageCreate(BaseModel):
    role: str
    content: str
    metadata: dict[str, Any] | None = None

class ChatMessageResponse(BaseModel):
    id: uuid.UUID
    role: str
    content: str
    widget: Widget | None = None
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class SessionHistoryResponse(BaseModel):
    session_id: uuid.UUID
    messages: list[ChatMessageResponse]
    current_step: str | None = None


# --- Action Schemas ---

class ChatUserAction(BaseModel):
    type: Literal['text', 'selection']
    content: dict[str, Any] 
    # content structure depends on type: 
    # text -> { "text": "..." }
    # selection -> { "field": "...", "value": "..." }
