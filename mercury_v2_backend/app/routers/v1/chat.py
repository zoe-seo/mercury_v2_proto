from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.deps.db import get_db
from app.services import chat_service
from app.schemas.chat import (
    ChatSessionCreate,
    ChatSessionUpdate,
    ChatSessionResponse,
    ChatSessionListResponse,
    ChatMessageCreate,
    ChatMessageResponse,
    ChatMessageListResponse
)
from app.core.auth import get_current_user
from app.core.exceptions import NotFoundException
from app.models.user import User

router = APIRouter(prefix="/chat", tags=["chat"])


@router.get("/sessions", response_model=ChatSessionListResponse)
async def get_sessions(
    project_id: str | None = Query(None, description="Filter by project ID"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get user's chat sessions with pagination."""
    import uuid as uuid_lib
    
    project_uuid = None
    if project_id:
        try:
            project_uuid = uuid_lib.UUID(project_id)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid project ID format"
            )
    
    sessions, pagination = await chat_service.get_sessions(
        db, current_user.id, project_uuid, page, page_size
    )
    
    return ChatSessionListResponse(
        items=[ChatSessionResponse.model_validate(s) for s in sessions],
        pagination=pagination
    )


@router.post("/sessions", response_model=ChatSessionResponse, status_code=status.HTTP_201_CREATED)
async def create_session(
    data: ChatSessionCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new chat session."""
    session = await chat_service.create_session(db, current_user.id, data)
    return ChatSessionResponse.model_validate(session)


@router.get("/sessions/{session_id}", response_model=ChatSessionResponse)
async def get_session(
    session_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get chat session by ID."""
    try:
        import uuid as uuid_lib
        session_uuid = uuid_lib.UUID(session_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid session ID format"
        )
    
    try:
        session = await chat_service.get_session_by_id(db, session_uuid, current_user.id)
        return ChatSessionResponse.model_validate(session)
    except NotFoundException as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )


@router.put("/sessions/{session_id}", response_model=ChatSessionResponse)
async def update_session(
    session_id: str,
    data: ChatSessionUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update a chat session."""
    try:
        import uuid as uuid_lib
        session_uuid = uuid_lib.UUID(session_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid session ID format"
        )
    
    try:
        session = await chat_service.update_session(db, session_uuid, current_user.id, data)
        return ChatSessionResponse.model_validate(session)
    except NotFoundException as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )


@router.get("/sessions/{session_id}/messages", response_model=ChatMessageListResponse)
async def get_messages(
    session_id: str,
    limit: int = Query(50, ge=1, le=200, description="Maximum number of messages"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get messages for a chat session."""
    try:
        import uuid as uuid_lib
        session_uuid = uuid_lib.UUID(session_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid session ID format"
        )
    
    try:
        messages = await chat_service.get_messages(db, session_uuid, current_user.id, limit)
        return ChatMessageListResponse(
            messages=[ChatMessageResponse.model_validate(m) for m in messages]
        )
    except NotFoundException as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )


@router.post("/sessions/{session_id}/messages", response_model=ChatMessageResponse, status_code=status.HTTP_201_CREATED)
async def create_message(
    session_id: str,
    data: ChatMessageCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new chat message."""
    try:
        import uuid as uuid_lib
        session_uuid = uuid_lib.UUID(session_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid session ID format"
        )
    
    try:
        message = await chat_service.create_message(db, session_uuid, current_user.id, data)
        return ChatMessageResponse.model_validate(message)
    except NotFoundException as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )


@router.post("/sessions/{session_id}/messages/stream")
async def stream_message(
    session_id: str,
    data: ChatMessageCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Stream a chat message with SSE (Server-Sent Events)."""
    from fastapi.responses import StreamingResponse
    import uuid as uuid_lib
    
    try:
        session_uuid = uuid_lib.UUID(session_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid session ID format"
        )
    
    try:
        # Stream the response
        response_stream = chat_service.stream_message(
            db, session_uuid, current_user.id, data
        )
        
        return StreamingResponse(
            response_stream,
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "X-Accel-Buffering": "no"  # Disable nginx buffering
            }
        )
    except NotFoundException as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )


@router.post("/sessions/{session_id}/generate-outlines", status_code=status.HTTP_202_ACCEPTED)
async def generate_outlines(
    session_id: str,
    prompt: str,
    count: int = 4,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Generate outline images asynchronously."""
    import uuid as uuid_lib
    from app.tasks.image_tasks import generate_outline_images_task
    
    try:
        session_uuid = uuid_lib.UUID(session_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid session ID format"
        )
    
    try:
        # Verify session belongs to user
        await chat_service.get_session_by_id(db, session_uuid, current_user.id)
        
        # Start Celery task
        task = generate_outline_images_task.delay(session_id, prompt, count)
        
        return {
            "task_id": task.id,
            "status": "processing"
        }
    except NotFoundException as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )


@router.post("/sessions/{session_id}/generate-design", status_code=status.HTTP_202_ACCEPTED)
async def generate_design(
    session_id: str,
    prompt: str,
    selected_outline_id: str | None = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Generate final design image asynchronously."""
    import uuid as uuid_lib
    from app.tasks.image_tasks import generate_design_image_task
    
    try:
        session_uuid = uuid_lib.UUID(session_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid session ID format"
        )
    
    try:
        # Verify session belongs to user
        await chat_service.get_session_by_id(db, session_uuid, current_user.id)
        
        # Start Celery task
        task = generate_design_image_task.delay(session_id, prompt, selected_outline_id)
        
        return {
            "task_id": task.id,
            "status": "processing"
        }
    except NotFoundException as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )


@router.get("/sessions/{session_id}/images")
async def get_session_images(
    session_id: str,
    image_type: str | None = Query(None, description="Filter by image type (outline/rendered)"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get generated images for a session."""
    import uuid as uuid_lib
    from sqlalchemy import select
    from app.models.generated_image import GeneratedImage
    from app.schemas.image import GeneratedImageResponse, GeneratedImageListResponse
    
    try:
        session_uuid = uuid_lib.UUID(session_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid session ID format"
        )
    
    try:
        # Verify session belongs to user
        await chat_service.get_session_by_id(db, session_uuid, current_user.id)
        
        # Build query
        query_filter = [GeneratedImage.session_id == session_uuid]
        if image_type:
            query_filter.append(GeneratedImage.image_type == image_type)
        
        query = (
            select(GeneratedImage)
            .where(*query_filter)
            .order_by(GeneratedImage.created_at.desc())
        )
        
        result = await db.execute(query)
        images = list(result.scalars().all())
        
        return GeneratedImageListResponse(
            images=[GeneratedImageResponse.model_validate(img) for img in images],
            total=len(images)
        )
    except NotFoundException as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )


@router.get("/tasks/{task_id}/status")
async def get_task_status(
    task_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get Celery task status."""
    from celery.result import AsyncResult
    from app.celery_app import celery_app
    from app.schemas.image import TaskStatusResponse
    
    task = AsyncResult(task_id, app=celery_app)
    
    response = TaskStatusResponse(
        task_id=task_id,
        status=task.state,
        result=task.result if task.ready() else None,
        progress=task.info if task.state == 'PROGRESS' else None
    )
    
    return response



