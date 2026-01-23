from pydantic import BaseModel, EmailStr, ConfigDict, Field, field_validator
from datetime import datetime
from typing import Literal
from enum import Enum
import uuid


class UserBase(BaseModel):
    """Base user schema."""
    email: EmailStr
    name: str = Field(..., min_length=1, max_length=100)

    @field_validator('email')
    @classmethod
    def lower_email(cls, v: str) -> str:
        return v.lower()


class UserCreate(UserBase):
    """Schema for user signup."""
    password: str = Field(..., min_length=8, max_length=100)


class UserLogin(BaseModel):
    """Schema for user login."""
    email: EmailStr
    password: str

    @field_validator('email')
    @classmethod
    def lower_email(cls, v: str) -> str:
        return v.lower()


class UserResponse(UserBase):
    """Schema for user response."""
    id: uuid.UUID
    created_at: datetime
    is_active: bool
    
    model_config = ConfigDict(from_attributes=True)


class UserUpdate(BaseModel):
    """Schema for updating user profile."""
    name: str | None = Field(None, min_length=1, max_length=100)


class PasswordChange(BaseModel):
    """Schema for password change."""
    current_password: str
    new_password: str = Field(..., min_length=8, max_length=100)


class TokenResponse(BaseModel):
    """Schema for JWT token response."""
    access_token: str
    token_type: str = "Bearer"


class AuthResponse(BaseModel):
    """Schema for authentication response (login/signup)."""
    user: UserResponse
    access_token: str
    token_type: str = "Bearer"


# ============ User Profile Schemas ============

class UserPreferences(BaseModel):
    """Schema for user designer preferences."""
    shoe_size_system: Literal["US", "UK", "EU", "MM"] | None = None
    gender_category: Literal["mens", "womens", "unisex", "kids"] | None = None
    style_tags: list[str] = Field(default_factory=list)


class NotificationSettings(BaseModel):
    """Schema for user notification settings."""
    email_creation_finished: bool = True
    email_weekly_report: bool = False
    app_browser_notification: bool = True


class UserStats(BaseModel):
    """Schema for user statistics."""
    projects_count: int = 0


class UserProfileResponse(UserBase):
    """Extended user profile response with all fields."""
    id: uuid.UUID
    nickname: str | None = None
    job_title: str | None = None
    bio: str | None = None
    avatar_url: str | None = None
    stats: UserStats
    preferences: UserPreferences
    notification_settings: NotificationSettings
    created_at: datetime
    is_active: bool
    
    model_config = ConfigDict(from_attributes=True)


class UserProfileUpdate(BaseModel):
    """Schema for updating basic profile information."""
    nickname: str | None = Field(None, max_length=100)
    job_title: str | None = Field(None, max_length=100)
    bio: str | None = Field(None, max_length=500)


class UserPreferencesUpdate(BaseModel):
    """Schema for updating user preferences."""
    shoe_size_system: Literal["US", "UK", "EU", "MM"] | None = None
    gender_category: Literal["mens", "womens", "unisex", "kids"] | None = None
    style_tags: list[str] | None = None


class NotificationSettingsUpdate(BaseModel):
    """Schema for updating notification settings."""
    email_creation_finished: bool | None = None
    email_weekly_report: bool | None = None
    app_browser_notification: bool | None = None


class AvatarUploadResponse(BaseModel):
    """Schema for avatar upload response."""
    avatar_url: str
