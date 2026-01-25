from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID
from app.models.design_brief import DesignBrief
from app.models.chat_session import ChatSession
from app.models.canvas_project import CanvasProject
from app.schemas.design_brief import DesignBriefCreate, DesignBriefUpdate
from app.core.exceptions import NotFoundException, ForbiddenException

async def get_chat_brief(db: AsyncSession, session_id: UUID, user_id: UUID) -> DesignBrief:
    # Verify session ownership
    chat_query = select(ChatSession).where(
        ChatSession.id == session_id,
        ChatSession.user_id == user_id
    )
    result = await db.execute(chat_query)
    chat_session = result.scalar_one_or_none()
    
    if not chat_session:
        raise NotFoundException(f"Chat session {session_id} not found")

    # Get Brief
    query = select(DesignBrief).where(DesignBrief.chat_session_id == session_id)
    result = await db.execute(query)
    brief = result.scalar_one_or_none()
    
    if not brief:
        raise NotFoundException(f"Design Brief for chat session {session_id} not found")
        
    return brief

async def upsert_chat_brief(
    db: AsyncSession, 
    session_id: UUID, 
    user_id: UUID, 
    data: DesignBriefCreate | DesignBriefUpdate
) -> DesignBrief:
    # Verify session ownership
    chat_query = select(ChatSession).where(
        ChatSession.id == session_id,
        ChatSession.user_id == user_id
    )
    result = await db.execute(chat_query)
    chat_session = result.scalar_one_or_none()
    
    if not chat_session:
        raise NotFoundException(f"Chat session {session_id} not found")

    # Check existing
    query = select(DesignBrief).where(DesignBrief.chat_session_id == session_id)
    result = await db.execute(query)
    brief = result.scalar_one_or_none()
    
    if brief:
        # Update
        if data.concept_info is not None:
            brief.concept_info = data.concept_info.model_dump() if data.concept_info else None
        if data.shoe_spec is not None:
            brief.shoe_spec = data.shoe_spec.model_dump() if data.shoe_spec else None
        if data.marketing_context is not None:
            brief.marketing_context = data.marketing_context.model_dump() if data.marketing_context else None
    else:
        # Create
        brief_data = data.model_dump()
        brief = DesignBrief(
            chat_session_id=session_id,
            concept_info=brief_data.get("concept_info"),
            shoe_spec=brief_data.get("shoe_spec"),
            marketing_context=brief_data.get("marketing_context")
        )
        db.add(brief)
    
    await db.commit()
    await db.refresh(brief)
    return brief

async def get_canvas_brief(db: AsyncSession, canvas_id: UUID, user_id: UUID) -> DesignBrief:
    # Verify canvas ownership
    canvas_query = select(CanvasProject).where(
        CanvasProject.id == canvas_id,
        CanvasProject.user_id == user_id
    )
    result = await db.execute(canvas_query)
    canvas_project = result.scalar_one_or_none()
    
    if not canvas_project:
        raise NotFoundException(f"Canvas project {canvas_id} not found")

    # Get Brief
    query = select(DesignBrief).where(DesignBrief.canvas_project_id == canvas_id)
    result = await db.execute(query)
    brief = result.scalar_one_or_none()
    
    if not brief:
        raise NotFoundException(f"Design Brief for canvas {canvas_id} not found")
        
    return brief

async def upsert_canvas_brief(
    db: AsyncSession, 
    canvas_id: UUID, 
    user_id: UUID, 
    data: DesignBriefCreate | DesignBriefUpdate
) -> DesignBrief:
    # Verify canvas ownership
    canvas_query = select(CanvasProject).where(
        CanvasProject.id == canvas_id,
        CanvasProject.user_id == user_id
    )
    result = await db.execute(canvas_query)
    canvas_project = result.scalar_one_or_none()
    
    if not canvas_project:
        raise NotFoundException(f"Canvas project {canvas_id} not found")

    # Check existing
    query = select(DesignBrief).where(DesignBrief.canvas_project_id == canvas_id)
    result = await db.execute(query)
    brief = result.scalar_one_or_none()
    
    if brief:
        # Update
        if data.concept_info is not None:
            brief.concept_info = data.concept_info.model_dump() if data.concept_info else None
        if data.shoe_spec is not None:
            brief.shoe_spec = data.shoe_spec.model_dump() if data.shoe_spec else None
        if data.marketing_context is not None:
            brief.marketing_context = data.marketing_context.model_dump() if data.marketing_context else None
    else:
        # Create
        brief_data = data.model_dump()
        brief = DesignBrief(
            canvas_project_id=canvas_id,
            concept_info=brief_data.get("concept_info"),
            shoe_spec=brief_data.get("shoe_spec"),
            marketing_context=brief_data.get("marketing_context")
        )
        db.add(brief)
    
    await db.commit()
    await db.refresh(brief)
    return brief

async def sync_brief_to_canvas(
    db: AsyncSession,
    canvas_id: UUID,
    source_chat_id: UUID,
    user_id: UUID
) -> DesignBrief:
    # 1. Get Source Brief
    try:
        source_brief = await get_chat_brief(db, source_chat_id, user_id)
    except NotFoundException:
        raise NotFoundException("Source chat brief not found")
        
    # 2. Upsert to Canvas
    # Construct update data from source brief
    # Since DesignBriefCreate expects nested models, we convert dicts back or just pass dicts if we handled that in Upsert
    # But upsert takes DesignBriefCreate which has Pydantic models.
    # source_brief field access gives dicts (JSONB).
    
    # Needs to convert JSONB dicts to Pydantic models or modify upsert to handle dicts.
    # Let's clean up upsert logic to handle both, or reconstruct Pydantic models.
    
    from app.schemas.design_brief import ConceptInfoBase, ShoeSpecBase, MarketingContextBase
    
    update_data = DesignBriefUpdate(
        concept_info=ConceptInfoBase(**source_brief.concept_info) if source_brief.concept_info else None,
        shoe_spec=ShoeSpecBase(**source_brief.shoe_spec) if source_brief.shoe_spec else None,
        marketing_context=MarketingContextBase(**source_brief.marketing_context) if source_brief.marketing_context else None
    )
    
    return await upsert_canvas_brief(db, canvas_id, user_id, update_data)
