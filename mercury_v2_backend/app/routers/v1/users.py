from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession

from app.deps.db import get_db
from app.services import user_service
from app.schemas.user import (
    UserProfileResponse,
    UserProfileUpdate,
    UserPreferencesUpdate,
    NotificationSettingsUpdate,
    AvatarUploadResponse
)
from app.schemas.responses import SuccessResponse
from app.core.auth import get_current_user
from app.core.exceptions import ValidationException
from app.models.user import User

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=SuccessResponse[UserProfileResponse])
async def get_current_user_profile(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get current user's full profile with stats."""
    profile_data = await user_service.get_user_profile(db, current_user.id)
    user_profile = UserProfileResponse(**profile_data)
    return SuccessResponse(data=user_profile, message="Success")


@router.put("/me", response_model=SuccessResponse[dict])
async def update_profile(
    data: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update basic profile information (nickname, job_title, bio)."""
    await user_service.update_user_profile(db, current_user.id, data)
    return SuccessResponse(
        data={"message": "Profile updated successfully"},
        message="Success"
    )


@router.put("/me/preferences", response_model=SuccessResponse[dict])
async def update_preferences(
    data: UserPreferencesUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update user preferences (shoe size system, gender category, style tags)."""
    await user_service.update_user_preferences(db, current_user.id, data)
    return SuccessResponse(
        data={"message": "Preferences updated successfully"},
        message="Success"
    )


@router.put("/me/notifications", response_model=SuccessResponse[dict])
async def update_notifications(
    data: NotificationSettingsUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update notification settings."""
    await user_service.update_notification_settings(db, current_user.id, data)
    return SuccessResponse(
        data={"message": "Notification settings updated successfully"},
        message="Success"
    )


@router.post("/me/avatar", response_model=SuccessResponse[AvatarUploadResponse])
async def upload_avatar(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Upload user avatar image."""
    # Validate file type
    allowed_types = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={
                "code": "VALIDATION_ERROR",
                "message": "Invalid file type",
                "details": [{"field": "file", "message": f"Only images are allowed ({', '.join(allowed_types)})"}]
            }
        )
    
    # Read file data
    file_data = await file.read()
    
    # Validate file size (max 5MB)
    max_size = 5 * 1024 * 1024  # 5MB
    if len(file_data) > max_size:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={
                "code": "VALIDATION_ERROR",
                "message": "File too large",
                "details": [{"field": "file", "message": "Avatar image must be less than 5MB"}]
            }
        )
    
    # Upload avatar
    avatar_url = await user_service.upload_user_avatar(
        db, 
        current_user.id, 
        file_data, 
        file.filename or "avatar.png"
    )
    
    avatar_response = AvatarUploadResponse(avatar_url=avatar_url)
    return SuccessResponse(data=avatar_response, message="Success")
