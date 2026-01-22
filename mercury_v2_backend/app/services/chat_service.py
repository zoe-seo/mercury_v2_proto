from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
import uuid
import math

from app.models.chat_session import ChatSession
from app.models.chat_message import ChatMessage
from app.schemas.chat import ChatSessionCreate, ChatSessionUpdate, ChatMessageCreate
from app.schemas.pagination import PaginationMeta
from app.core.exceptions import NotFoundException


async def get_sessions(
    db: AsyncSession,
    user_id: uuid.UUID,
    project_id: uuid.UUID | None = None,
    page: int = 1,
    page_size: int = 20
) -> tuple[list[ChatSession], PaginationMeta]:
    """Get user's chat sessions with pagination and optional project filter."""
    # Validate pagination params
    page = max(1, page)
    page_size = min(max(1, page_size), 100)
    
    # Build query
    query_filter = [ChatSession.user_id == user_id, ChatSession.is_archived == False]
    if project_id:
        query_filter.append(ChatSession.project_id == project_id)
    
    # Count total items
    count_query = select(func.count()).select_from(ChatSession).where(*query_filter)
    total_items = await db.scalar(count_query) or 0
    
    # Calculate pagination
    total_pages = math.ceil(total_items / page_size) if total_items > 0 else 1
    offset = (page - 1) * page_size
    
    # Get sessions
    query = (
        select(ChatSession)
        .where(*query_filter)
        .order_by(ChatSession.created_at.desc())
        .offset(offset)
        .limit(page_size)
    )
    result = await db.execute(query)
    sessions = list(result.scalars().all())
    
    pagination = PaginationMeta(
        page=page,
        page_size=page_size,
        total_items=total_items,
        total_pages=total_pages
    )
    
    return sessions, pagination


async def get_session_by_id(
    db: AsyncSession,
    session_id: uuid.UUID,
    user_id: uuid.UUID
) -> ChatSession:
    """Get chat session by ID."""
    result = await db.execute(
        select(ChatSession).where(
            ChatSession.id == session_id,
            ChatSession.user_id == user_id,
            ChatSession.is_archived == False
        )
    )
    session = result.scalar_one_or_none()
    if not session:
        raise NotFoundException(f"Chat session with id {session_id} not found")
    return session


async def create_session(
    db: AsyncSession,
    user_id: uuid.UUID,
    data: ChatSessionCreate
) -> ChatSession:
    """Create a new chat session."""
    session = ChatSession(
        user_id=user_id,
        project_id=data.project_id,
        title=data.title,
        session_state="interview"  # Default state
    )
    
    db.add(session)
    await db.commit()
    await db.refresh(session)
    return session


async def update_session(
    db: AsyncSession,
    session_id: uuid.UUID,
    user_id: uuid.UUID,
    data: ChatSessionUpdate
) -> ChatSession:
    """Update a chat session."""
    session = await get_session_by_id(db, session_id, user_id)
    
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(session, field, value)
    
    await db.commit()
    await db.refresh(session)
    return session


async def get_messages(
    db: AsyncSession,
    session_id: uuid.UUID,
    user_id: uuid.UUID,
    limit: int = 50
) -> list[ChatMessage]:
    """Get messages for a chat session."""
    # Verify session belongs to user
    await get_session_by_id(db, session_id, user_id)
    
    # Get messages
    query = (
        select(ChatMessage)
        .where(ChatMessage.session_id == session_id)
        .order_by(ChatMessage.sequence_number.asc())
        .limit(min(limit, 200))  # Max 200 messages
    )
    result = await db.execute(query)
    return list(result.scalars().all())


async def create_message(
    db: AsyncSession,
    session_id: uuid.UUID,
    user_id: uuid.UUID,
    data: ChatMessageCreate
) -> ChatMessage:
    """Create a new chat message."""
    # Verify session belongs to user
    await get_session_by_id(db, session_id, user_id)
    
    # Get next sequence number
    count_query = select(func.count()).select_from(ChatMessage).where(
        ChatMessage.session_id == session_id
    )
    message_count = await db.scalar(count_query) or 0
    
    message = ChatMessage(
        session_id=session_id,
        role=data.role,
        content=data.content,
        message_metadata=data.metadata,
        sequence_number=message_count + 1
    )
    
    db.add(message)
    await db.commit()
    await db.refresh(message)
    return message


async def stream_message(
    db: AsyncSession,
    session_id: uuid.UUID,
    user_id: uuid.UUID,
    data: ChatMessageCreate
):
    """
    Stream a chat message with LLM response.
    
    This is an async generator that yields SSE events.
    """
    from typing import AsyncGenerator
    from app.core.llm import stream_chat_completion, format_conversation_history
    from app.core.sse import stream_sse_response
    
    # Verify session belongs to user
    await get_session_by_id(db, session_id, user_id)
    
    # Save user message first
    user_message = await create_message(db, session_id, user_id, data)
    
    # Get conversation history
    messages = await get_messages(db, session_id, user_id, limit=50)
    conversation_history = format_conversation_history(messages)
    
    # Get next sequence number for assistant message
    count_query = select(func.count()).select_from(ChatMessage).where(
        ChatMessage.session_id == session_id
    )
    message_count = await db.scalar(count_query) or 0
    
    # Create assistant message placeholder
    assistant_message = ChatMessage(
        session_id=session_id,
        role="assistant",
        content="",  # Will be updated after streaming
        sequence_number=message_count + 1
    )
    db.add(assistant_message)
    await db.commit()
    await db.refresh(assistant_message)
    
    # Stream LLM response
    llm_stream = stream_chat_completion(conversation_history)
    
    # Collect full content while streaming
    full_content = ""
    
    async def content_generator() -> AsyncGenerator[str, None]:
        nonlocal full_content
        async for delta in llm_stream:
            full_content += delta
            yield delta
    
    # Stream SSE events
    async for sse_event in stream_sse_response(
        str(assistant_message.id),
        assistant_message.sequence_number,
        content_generator()
    ):
        yield sse_event
    
    # Update assistant message with full content
    assistant_message.content = full_content
    await db.commit()

