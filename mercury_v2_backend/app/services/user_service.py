from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import uuid

from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate, PasswordChange
from app.core.auth import hash_password, verify_password
from app.core.exceptions import NotFoundException, UnauthorizedException, ValidationException


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
