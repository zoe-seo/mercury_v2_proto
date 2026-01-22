from pydantic import BaseModel, EmailStr, ConfigDict, Field
from datetime import datetime
import uuid


class UserBase(BaseModel):
    """Base user schema."""
    email: EmailStr
    name: str = Field(..., min_length=1, max_length=100)


class UserCreate(UserBase):
    """Schema for user signup."""
    password: str = Field(..., min_length=8, max_length=100)


class UserLogin(BaseModel):
    """Schema for user login."""
    email: EmailStr
    password: str


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
