from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
import uuid
from fastapi import UploadFile

from app.models.user import User
from app.models.project import Project
from app.schemas.user import (
    UserCreate, 
    UserUpdate, 
    PasswordChange,
    UserProfileUpdate,
    UserPreferencesUpdate,
    NotificationSettingsUpdate,
    UserPreferences,
    NotificationSettings,
    UserStats
)
from app.core.auth import hash_password, verify_password
from app.core.exceptions import NotFoundException, UnauthorizedException, ValidationException
from app.core.storage import upload_image, get_image_url, delete_image


async def get_user_by_email(db: AsyncSession, email: str) -> User | None:
    """Get user by email."""
    result = await db.execute(select(User).where(User.email == email))
    return result.scalar_one_or_none()


async def get_user_by_id(db: AsyncSession, user_id: uuid.UUID) -> User:
    """Get user by ID."""
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise NotFoundException(f"User with id {user_id} not found")
    return user


async def signup(db: AsyncSession, data: UserCreate) -> User:
    """Create a new user account."""
    # Check if email already exists
    existing_user = await get_user_by_email(db, data.email)
    if existing_user:
        raise ValidationException(
            "Email already registered",
            [{"field": "email", "message": "This email is already in use"}]
        )
    
    # Create new user
    user = User(
        email=data.email,
        password_hash=hash_password(data.password),
        name=data.name
    )
    
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


async def login(db: AsyncSession, email: str, password: str) -> User:
    """Authenticate user and return user object."""
    user = await get_user_by_email(db, email)
    
    if not user:
        raise UnauthorizedException("Invalid email or password")
    
    if not verify_password(password, user.password_hash):
        raise UnauthorizedException("Invalid email or password")
    
    if not user.is_active:
        raise UnauthorizedException("Account is inactive")
    
    return user


async def update_user(db: AsyncSession, user_id: uuid.UUID, data: UserUpdate) -> User:
    """Update user profile."""
    user = await get_user_by_id(db, user_id)
    
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(user, field, value)
    
    await db.commit()
    await db.refresh(user)
    return user


async def change_password(
    db: AsyncSession, 
    user_id: uuid.UUID, 
    data: PasswordChange
) -> None:
    """Change user password."""
    user = await get_user_by_id(db, user_id)
    
    # Verify current password
    if not verify_password(data.current_password, user.password_hash):
        raise UnauthorizedException("Current password is incorrect")
    
    # Update password
    user.password_hash = hash_password(data.new_password)
    await db.commit()


# ============ User Profile Functions ============

async def get_user_profile(db: AsyncSession, user_id: uuid.UUID) -> dict:
    """
    Get full user profile with stats.
    
    Returns a dict with user data, stats, preferences, and notification_settings.
    """
    user = await get_user_by_id(db, user_id)
    
    # Count user's projects
    result = await db.execute(
        select(func.count(Project.id))
        .where(Project.user_id == user_id)
        .where(Project.is_deleted == False)
    )
    projects_count = result.scalar() or 0
    
    # Build response with defaults for JSONB fields
    return {
        "id": user.id,
        "email": user.email,
        "name": user.name,
        "nickname": user.nickname,
        "job_title": user.job_title,
        "bio": user.bio,
        "avatar_url": user.avatar_url,
        "stats": UserStats(projects_count=projects_count),
        "preferences": UserPreferences(**(user.preferences or {})),
        "notification_settings": NotificationSettings(**(user.notification_settings or {})),
        "created_at": user.created_at,
        "is_active": user.is_active
    }


async def update_user_profile(
    db: AsyncSession, 
    user_id: uuid.UUID, 
    data: UserProfileUpdate
) -> User:
    """Update basic user profile information."""
    user = await get_user_by_id(db, user_id)
    
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(user, field, value)
    
    await db.commit()
    await db.refresh(user)
    return user


async def update_user_preferences(
    db: AsyncSession,
    user_id: uuid.UUID,
    data: UserPreferencesUpdate
) -> User:
    """Update user preferences."""
    user = await get_user_by_id(db, user_id)
    
    # Get existing preferences or empty dict
    current_prefs = user.preferences or {}
    
    # Update with new values (only non-None values)
    update_data = data.model_dump(exclude_unset=True, exclude_none=True)
    current_prefs.update(update_data)
    
    user.preferences = current_prefs
    await db.commit()
    await db.refresh(user)
    return user


async def update_notification_settings(
    db: AsyncSession,
    user_id: uuid.UUID,
    data: NotificationSettingsUpdate
) -> User:
    """Update user notification settings."""
    user = await get_user_by_id(db, user_id)
    
    # Get existing settings or empty dict
    current_settings = user.notification_settings or {}
    
    # Update with new values (only non-None values)
    update_data = data.model_dump(exclude_unset=True, exclude_none=True)
    current_settings.update(update_data)
    
    user.notification_settings = current_settings
    await db.commit()
    await db.refresh(user)
    return user


async def upload_user_avatar(
    db: AsyncSession,
    user_id: uuid.UUID,
    file_data: bytes,
    filename: str
) -> str:
    """
    Upload user avatar image.
    
    Returns the avatar URL.
    """
    user = await get_user_by_id(db, user_id)
    
    # Delete old avatar if exists
    if user.avatar_url:
        try:
            # Extract object name from URL
            old_object_name = user.avatar_url.split('/')[-2] + '/' + user.avatar_url.split('/')[-1]
            delete_image(old_object_name)
        except Exception as e:
            # Log but don't fail if old avatar deletion fails
            print(f"Failed to delete old avatar: {e}")
    
    # Upload new avatar with avatars/ prefix
    object_name = f"avatars/{user_id}_{filename}"
    upload_image(file_data, object_name)
    
    # Get public URL
    avatar_url = get_image_url(object_name)
    
    # Update user
    user.avatar_url = avatar_url
    await db.commit()
    await db.refresh(user)
    
    return avatar_url
