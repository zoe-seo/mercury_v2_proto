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
    import logging
    logger = logging.getLogger(__name__)
    
    # Validate pagination params
    page = max(1, page)
    page_size = min(max(1, page_size), 100)
    
    # Build query
    query_filter = [ChatSession.user_id == user_id, ChatSession.is_archived == False]
    if project_id:
        query_filter.append(ChatSession.project_id == project_id)
    
    logger.info(f"🔍 Getting sessions for user_id: {user_id}, project_id: {project_id}")
    
    # Count total items
    count_query = select(func.count()).select_from(ChatSession).where(*query_filter)
    total_items = await db.scalar(count_query) or 0
    
    logger.info(f"📊 Total sessions found: {total_items}")
    
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
    
    logger.info(f"✅ Returning {len(sessions)} sessions")
    
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
    import logging
    logger = logging.getLogger(__name__)
    
    logger.info(f"🆕 Creating session for user_id: {user_id}, title: {data.title}")
    
    session = ChatSession(
        user_id=user_id,
        project_id=data.project_id,
        title=data.title,
        session_state="interview"  # Default state
    )
    
    db.add(session)
    await db.commit()
    await db.refresh(session)
    
    logger.info(f"✅ Session created: {session.id}")
    
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


async def delete_session(
    db: AsyncSession,
    session_id: uuid.UUID,
    user_id: uuid.UUID
) -> None:
    """Delete (archive) a chat session."""
    import logging
    logger = logging.getLogger(__name__)
    
    session = await get_session_by_id(db, session_id, user_id)
    
    logger.info(f"🗑️ Archiving session: {session_id}")
    
    # Soft delete - set is_archived to True
    session.is_archived = True
    
    await db.commit()
    
    logger.info(f"✅ Session archived: {session_id}")



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
    
    # SSE Generator Wrapper
    async def sse_generator():
        from app.core.sse import sse_event
        nonlocal full_content
        
        yield await sse_event("message_start", {
            "message_id": str(assistant_message.id),
            "sequence_number": assistant_message.sequence_number
        })

        buffer = ""
        in_tag = False
        
        async for delta in llm_stream:
            buffer += delta
            
            if not in_tag:
                if "<brief>" in buffer:
                    prefix, rest = buffer.split("<brief>", 1)
                    if prefix:
                        full_content += prefix
                        yield await sse_event("content_delta", {"delta": prefix})
                    
                    buffer = rest # Start accumulating brief
                    in_tag = True
                else:
                    # Yield safe part
                    # Keep last 6 chars in case they are part of <brief>
                    if len(buffer) > 6:
                        safe_chunk = buffer[:-6]
                        buffer = buffer[-6:]
                        full_content += safe_chunk
                        yield await sse_event("content_delta", {"delta": safe_chunk})
            
            else:
                # We are recording brief
                if "</brief>" in buffer:
                    brief_str, suffix = buffer.split("</brief>", 1)
                    
                    # Process Brief (Don't yield content)
                    import json
                    try:
                        brief_data = json.loads(brief_str)
                        yield await sse_event("brief_request", {
                            "message_id": str(assistant_message.id),
                            "brief_data": brief_data,
                            "is_required": True
                        })
                        assistant_message.message_metadata = {"brief_request": {"brief_data": brief_data}}
                    except:
                        # Parse failed, treat as text
                        fallback = f"<brief>{brief_str}</brief>"
                        full_content += fallback
                        yield await sse_event("content_delta", {"delta": fallback})
                    
                    # Handle suffix
                    buffer = suffix
                    in_tag = False
                    
                    # If suffix has more content, next loop will handle or flush at end
                    if buffer:
                        full_content += buffer
                        yield await sse_event("content_delta", {"delta": buffer})
                        buffer = ""
                else:
                    # Keep buffering brief
                    pass

        # Flush remaining
        if buffer:
            if in_tag:
                # Incomplete tag at end of stream? Just output it.
                fallback = f"<brief>{buffer}"
                full_content += fallback
                yield await sse_event("content_delta", {"delta": fallback})
            else:
                full_content += buffer
                yield await sse_event("content_delta", {"delta": buffer})

        yield await sse_event("message_complete", {
            "message_id": str(assistant_message.id),
            "content": full_content
        })
        
        yield await sse_event("done", {})

    async for sse_chunk in sse_generator():
        yield sse_chunk
    
    # Update assistant message with full content
    assistant_message.content = full_content
    # Flag to commit metadata update if happened
    await db.commit()

