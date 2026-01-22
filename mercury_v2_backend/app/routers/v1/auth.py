from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.deps.db import get_db
from app.services import user_service
from app.schemas.user import (
    UserCreate, 
    UserLogin, 
    UserResponse, 
    UserUpdate, 
    PasswordChange,
    AuthResponse
)
from app.schemas.responses import SuccessResponse
from app.core.auth import create_access_token, get_current_user
from app.core.exceptions import UnauthorizedException, ValidationException
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["authentication"])


@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def signup(data: UserCreate, db: AsyncSession = Depends(get_db)):
    """Register a new user account."""
    try:
        user = await user_service.signup(db, data)
        
        # Create access token
        access_token = create_access_token(data={"sub": str(user.id)})
        
        return AuthResponse(
            user=UserResponse.model_validate(user),
            access_token=access_token,
            token_type="Bearer"
        )
    except ValidationException as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={"code": "VALIDATION_ERROR", "message": e.message, "details": e.details}
        )


@router.post("/login", response_model=AuthResponse)
async def login(data: UserLogin, db: AsyncSession = Depends(get_db)):
    """Authenticate user and return JWT token."""
    try:
        user = await user_service.login(db, data.email, data.password)
        
        # Create access token
        access_token = create_access_token(data={"sub": str(user.id)})
        
        return AuthResponse(
            user=UserResponse.model_validate(user),
            access_token=access_token,
            token_type="Bearer"
        )
    except UnauthorizedException as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e)
        )


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(current_user: User = Depends(get_current_user)):
    """Logout user (client should discard the token)."""
    # In a stateless JWT system, logout is handled client-side
    # The client should discard the token
    # For more security, you could implement a token blacklist
    return None


@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(current_user: User = Depends(get_current_user)):
    """Get current user profile."""
    return UserResponse.model_validate(current_user)


@router.put("/password", response_model=SuccessResponse[dict])
async def change_password(
    data: PasswordChange,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Change user password."""
    try:
        await user_service.change_password(db, current_user.id, data)
        return SuccessResponse(
            data={"message": "Password updated successfully"},
            message="Success"
        )
    except UnauthorizedException as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e)
        )
