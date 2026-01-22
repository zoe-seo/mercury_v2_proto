from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime
import uuid
from typing import Any
from app.schemas.pagination import PaginationMeta


class ChatSessionBase(BaseModel):
    """Base chat session schema."""
    title: str = Field(..., min_length=1, max_length=200)
    project_id: uuid.UUID | None = None


class ChatSessionCreate(ChatSessionBase):
    """Schema for creating a chat session."""
    pass


class ChatSessionUpdate(BaseModel):
    """Schema for updating a chat session."""
    title: str | None = Field(None, min_length=1, max_length=200)
    brand_identity: dict[str, Any] | None = None
    preferences: dict[str, Any] | None = None
    session_state: str | None = None


class ChatSessionResponse(ChatSessionBase):
    """Schema for chat session response."""
    id: uuid.UUID
    user_id: uuid.UUID
    brand_identity: dict[str, Any] | None = None
    preferences: dict[str, Any] | None = None
    session_state: str | None = None
    created_at: datetime
    updated_at: datetime
    is_archived: bool
    
    model_config = ConfigDict(from_attributes=True)


class ChatSessionListResponse(BaseModel):
    """Schema for chat session list response with pagination."""
    items: list[ChatSessionResponse]
    pagination: PaginationMeta


class ChatMessageBase(BaseModel):
    """Base chat message schema."""
    content: str = Field(..., min_length=1)


class ChatMessageCreate(ChatMessageBase):
    """Schema for creating a chat message."""
    role: str = Field(..., pattern="^(user|assistant|system)$")
    metadata: dict[str, Any] | None = None


class ChatMessageResponse(ChatMessageBase):
    """Schema for chat message response."""
    id: uuid.UUID
    session_id: uuid.UUID
    role: str
    message_metadata: dict[str, Any] | None = None
    created_at: datetime
    sequence_number: int
    
    model_config = ConfigDict(from_attributes=True)


class ChatMessageListResponse(BaseModel):
    """Schema for chat message list response."""
    messages: list[ChatMessageResponse]
