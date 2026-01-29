from fastapi import APIRouter, Depends, HTTPException, status, Query, Body
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
import uuid
from celery.result import AsyncResult

from app.deps.db import get_db
from app.services import chat_service
from app.schemas.chat import (
    ChatSessionCreate,
    ChatSessionResponse,
    ChatSessionListResponse,
    ChatUserAction,
    SessionHistoryResponse,
    ChatMessageResponse
)
from app.schemas.responses import SuccessResponse
from app.core.auth import get_current_user
from app.core.exceptions import NotFoundException
from app.models.user import User
from app.celery_app import celery_app

router = APIRouter(prefix="/chat", tags=["chat"])


@router.get("/sessions", response_model=ChatSessionListResponse)
async def get_sessions(
    project_id: str | None = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get user's chat sessions."""
    project_uuid = None
    if project_id:
        try:
            project_uuid = uuid.UUID(project_id)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid project ID")
    
    sessions, pagination = await chat_service.get_sessions(
        db, current_user.id, project_uuid, page, page_size
    )
    
    return ChatSessionListResponse(
        items=[ChatSessionResponse.model_validate(s) for s in sessions],
        pagination=pagination
    )


@router.post("/sessions", status_code=status.HTTP_201_CREATED)
async def create_session(
    data: ChatSessionCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new chat session."""
    session = await chat_service.create_session(db, current_user.id, data)
    return SuccessResponse(
        data=ChatSessionResponse.model_validate(session),
        message="Session created successfully"
    )


@router.get("/sessions/{session_id}", response_model=SessionHistoryResponse)
async def get_session_history(
    session_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get session history."""
    try:
        session_uuid = uuid.UUID(session_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid session ID")
    
    try:
        session = await chat_service.get_session_by_id(db, session_uuid, current_user.id)
        messages = await chat_service.get_messages(db, session_uuid, current_user.id, limit=100)
        
        # Helper to map widget from metadata
        def map_msg(m):
            resp = ChatMessageResponse.model_validate(m)
            if m.message_metadata and "widget" in m.message_metadata:
                resp.widget = m.message_metadata["widget"]
            return resp

        return SessionHistoryResponse(
            session_id=session.id,
            messages=[map_msg(m) for m in messages],
            current_step=session.session_state
        )
    except NotFoundException as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/sessions/{session_id}/message")
async def send_message(
    session_id: str,
    action: ChatUserAction,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Send message and stream response (SSE)."""
    try:
        session_uuid = uuid.UUID(session_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid session ID")

    try:
        stream = chat_service.stream_rich_message(
            db, session_uuid, current_user.id, action
        )

        return StreamingResponse(
            stream,
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive"
            }
        )
    except NotFoundException as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/tasks/{task_id}")
async def get_task_status(
    task_id: str,
    current_user: User = Depends(get_current_user)
):
    """
    Get Celery task status for image generation.

    Returns:
        - status: pending | generating | completed | failed
        - progress: Progress info (if available)
        - image_id: Generated image ID (if completed)
        - image_url: Image URL (if completed)
    """
    try:
        task = AsyncResult(task_id, app=celery_app)

        if task.state == 'PENDING':
            return {
                "status": "pending",
                "task_id": task_id
            }
        elif task.state == 'PROGRESS':
            return {
                "status": "generating",
                "task_id": task_id,
                "progress": task.info
            }
        elif task.state == 'SUCCESS':
            # Task completed successfully
            # Result should be the image_id from the task
            image_id = task.result

            # Fetch image URL from database
            from app.models.generated_image import GeneratedImage
            from sqlalchemy import select
            from app.deps.db import get_db

            async for db in get_db():
                result = await db.execute(
                    select(GeneratedImage).where(GeneratedImage.id == uuid.UUID(image_id))
                )
                image = result.scalar_one_or_none()

                if image:
                    return {
                        "status": "completed",
                        "task_id": task_id,
                        "image_id": image_id,
                        "image_url": image.image_url
                    }
                else:
                    return {
                        "status": "completed",
                        "task_id": task_id,
                        "image_id": image_id,
                        "image_url": None
                    }
        elif task.state == 'FAILURE':
            return {
                "status": "failed",
                "task_id": task_id,
                "error": str(task.info)
            }
        else:
            return {
                "status": task.state.lower(),
                "task_id": task_id
            }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching task status: {str(e)}")
