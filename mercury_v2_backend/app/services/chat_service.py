from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, update
import uuid
import math
import json
import asyncio

from app.models.chat_session import ChatSession
from app.models.chat_message import ChatMessage
from app.models.design_brief import DesignBrief
from app.schemas.chat import ChatSessionCreate, ChatSessionUpdate, ChatUserAction, Widget
from app.schemas.pagination import PaginationMeta
from app.core.exceptions import NotFoundException
from app.core.sse import sse_event
from app.core.llm import generate_step_response, format_conversation_history
from app.config.design_steps import get_next_step

async def get_sessions(
    db: AsyncSession,
    user_id: uuid.UUID,
    project_id: uuid.UUID | None = None,
    page: int = 1,
    page_size: int = 20
) -> tuple[list[ChatSession], PaginationMeta]:
    """Get user's chat sessions with pagination."""
    # ... (Keep existing implementation)
    page = max(1, page)
    page_size = min(max(1, page_size), 100)
    
    query_filter = [ChatSession.user_id == user_id, ChatSession.is_archived == False]
    if project_id:
        query_filter.append(ChatSession.project_id == project_id)
    
    count_query = select(func.count()).select_from(ChatSession).where(*query_filter)
    total_items = await db.scalar(count_query) or 0
    
    total_pages = math.ceil(total_items / page_size) if total_items > 0 else 1
    offset = (page - 1) * page_size
    
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
        page=page, page_size=page_size, total_items=total_items, total_pages=total_pages
    )
    return sessions, pagination


async def get_session_by_id(db: AsyncSession, session_id: uuid.UUID, user_id: uuid.UUID) -> ChatSession:
    query = select(ChatSession).where(
        ChatSession.id == session_id,
        ChatSession.user_id == user_id,
        ChatSession.is_archived == False
    )
    result = await db.execute(query)
    session = result.scalar_one_or_none()
    if not session:
        raise NotFoundException(f"Chat session {session_id} not found")
    return session


async def create_session(db: AsyncSession, user_id: uuid.UUID, data: ChatSessionCreate) -> ChatSession:
    title = data.initial_message[:50] if data.initial_message else "New Design"
    session = ChatSession(
        user_id=user_id,
        title=title,
        session_state="init"
    )
    db.add(session)
    await db.commit()
    await db.refresh(session)
    
    # Create associated DesignBrief
    brief = DesignBrief(chat_session_id=session.id)
    db.add(brief)
    await db.commit()
    
    return session


async def get_messages(db: AsyncSession, session_id: uuid.UUID, user_id: uuid.UUID, limit: int = 50) -> list[ChatMessage]:
    await get_session_by_id(db, session_id, user_id)
    query = (
        select(ChatMessage)
        .where(ChatMessage.session_id == session_id)
        .order_by(ChatMessage.sequence_number.asc())
        .limit(limit)
    )
    result = await db.execute(query)
    return list(result.scalars().all())


async def create_message(db: AsyncSession, session_id: uuid.UUID, role: str, content: str, metadata: dict | None = None) -> ChatMessage:
    count_query = select(func.count()).select_from(ChatMessage).where(ChatMessage.session_id == session_id)
    count = await db.scalar(count_query) or 0
    
    msg = ChatMessage(
        session_id=session_id,
        role=role,
        content=content,
        message_metadata=metadata,
        sequence_number=count + 1
    )
    db.add(msg)
    await db.commit()
    await db.refresh(msg)
    return msg


# --- Rich Chat Logic ---

async def stream_rich_message(
    db: AsyncSession,
    session_id: uuid.UUID,
    user_id: uuid.UUID,
    action: ChatUserAction
):
    """
    Handle User Action -> Update State -> Determine Next Step -> Stream Response
    """
    # 1. Verify Session & Get Brief
    session = await get_session_by_id(db, session_id, user_id)

    brief_query = select(DesignBrief).where(DesignBrief.chat_session_id == session_id)
    brief = (await db.execute(brief_query)).scalar_one_or_none()
    if not brief:
        brief = DesignBrief(chat_session_id=session_id)
        db.add(brief)
        await db.commit()

    shoe_spec = brief.shoe_spec or {}

    # 2. Process User Action
    user_content = ""
    if action.type == "text":
        user_content = action.content.get("text", "")

    elif action.type == "selection":
        field = action.content.get("field")
        value = action.content.get("value")

        # Create natural language description
        field_labels = {
            "target_user": "타겟",
            "outline_id": "아웃라인",
            "sole_id": "솔",
            "style_keywords": "스타일"
        }
        field_label = field_labels.get(field, field)
        user_content = f"{field_label}: {value}"

        if field:
            shoe_spec[field] = value
            # Update Brief
            await db.execute(
                update(DesignBrief)
                .where(DesignBrief.id == brief.id)
                .values(shoe_spec=shoe_spec)
            )
            await db.commit()

    # Save User Message
    await create_message(db, session_id, "user", user_content)

    # Emit user_message event (echo)
    yield await sse_event("user_message", {
        "id": str(uuid.uuid4()),
        "role": "user",
        "content": user_content
    })

    # 3. Determine Next Step (Dynamic)
    next_step_config = get_next_step(shoe_spec)

    if not next_step_config:
        # Should not happen, but handle gracefully
        yield await sse_event("done", {})
        return

    next_step_name = next_step_config["name"]

    # Update Session State
    session.session_state = next_step_name
    await db.commit()

    # 4. Generate AI Response with LLM
    # Get conversation history
    messages = await get_messages(db, session_id, user_id, limit=10)
    conversation_history = format_conversation_history(messages[:-1])  # Exclude the user message we just added

    # Prepare context for step instruction
    context = {
        "shoe_spec": shoe_spec,
        **shoe_spec  # Unpack shoe_spec for direct field access
    }

    # Stream AI response
    assistant_text = ""
    async for delta in generate_step_response(
        conversation_history=conversation_history,
        user_input=user_content,
        step_instruction=next_step_config["system_instruction"],
        context=context
    ):
        assistant_text += delta
        yield await sse_event("text_delta", {"delta": delta})
        await asyncio.sleep(0.02)  # Smoother streaming

    # 5. Send Widget (if not result step)
    widget_payload = None
    if next_step_name == "result":
        # Final step - generate image with Celery
        from app.tasks.image_tasks import generate_design_image_task

        # Build prompt (hardcoded for now, log collected data)
        print("=" * 60)
        print("[IMAGE GENERATION] Collected shoe spec:")
        print(f"  - Target: {shoe_spec.get('target_user', 'N/A')}")
        print(f"  - Outline: {shoe_spec.get('outline_id', 'N/A')}")
        print(f"  - Sole: {shoe_spec.get('sole_id', 'N/A')}")
        print(f"  - Style: {shoe_spec.get('style_keywords', 'N/A')}")
        print("=" * 60)

        # Hardcoded prompt for now (will be enhanced later)
        hardcoded_prompt = """
        아래의 JSON을 분석하고 신발 디자인을 설계하여 이미지 생성

        {
        "camera": {
            "device": "전문가용 미러리스 DSLR",
            "lens": "85mm 단렌즈 (매크로 기능 포함)",
            "focal_length": "85mm",
            "exposure": {
            "aperture": "f/8.0",
            "shutter_speed": "1/125초",
            "iso": 100
            },
            "color_profile": "내추럴 소프트 프로파일, 하이 다이나믹 레인지(HDR)"
        },
        "lighting": {
            "type": "소프트박스 확산형 스튜디오 조명",
            "position": "3점 조명 (키, 필, 백 라이트)",
            "intensity": "중간 세기, 부드러운 그림자",
            "color_temperature": "5500K (중립 화이트)"
        },
        "composition": {
            "angle": "신발 한짝 측면 뷰 (프로필)",
            "ratio": "3:4",
            "perspective": "눈높이 (아이레벨)",
            "framing": "여백이 깔끔한 중앙 구도"
        },
        "background": {
            "elements": "단색의 미니멀한 배경",
            "environment": "스튜디오 설정",
            "texture": "매끄럽고 반사가 없는 매트한 질감",
            "color": "매우 밝은 그레이 / 오프화이트"
        },
        "concept": {
            "theme": "범용성을 타겟하는 스탠다드 쿠션감의 러닝화",
            "outline": "무릎이나 발목 데미지를 최소화, 두툼한 미드솔",
            "reference": "나이키 페가수스의 외형만 참고하고 세부적인 디자인을 따라하지 말 것",
            "naming": "가벼운 착용감을 위트있게 강조",
            "design": "과하지 않은 디테일로 심플함과 전문성을 강조한 디자인"
        },
        "sole": {
            "midsole_material": "고성능 레이싱을 위한 고탄성 경량 합성 폼",
            "midsole_texture": "미드솔 옆면과 후면 전체를 감싸는 미세하고 부드러운 대각선 질감",
            "outsole_shape": "공기역학적 성능을 극대화한 부드럽게 올라간 힐 디자인",
            "outsole_pattern": "지면 접지력을 높이기 위해 설계된 동심원 형태의 기하학적 타원형 트레드 패턴",
            "thickness": "약 4cm 이상의 두꺼운 청키 플랫폼 및 맥시멀리스트 실루엣",
            "color": "매트하고 일관된 톤의 트리플 블랙(Triple Black) 및 다크 안트라사이트",
            "branding": "아웃솔 바닥면 접지 패턴 내에 통합되어 있는 대형 로고 심볼"
        },
        "upper": {
            "material": "부위별로 직조 밀도가 다른 엔지니어드 메쉬 및 테크니컬 고기능성 소재 조합",
            "pattern": "전체적으로 통일감 있는 단일 패턴의 메쉬 소재",
            "overlay": "필수적인 부분과 디자인적 포인트로 무봉제(No-sew) TPU 필름",
            "branding_detail": "오버레이 위에 적용된 디보싱(Debossing) 타이포그래피 및 톤온톤 로고 배치"
        },
        "color": {
            "overall_tone": "균일하고 매트한 질감의 블랙",
            "accents": "Gray",
            "logo_symbol": "톤온톤 (미니멀 브랜딩)"
        },
        "detail": {
            "shoelace": "납작한 면 신발끈",
            "heel_tab": "고밀도로 직조된 웨빙, 신발 뒤축에 작게",
            "logo": "heel_tab 위에 직조 방식의 브랜드 로고를 배치하거나 고주파 방식의 브랜드 배치",
        }
        }
        """

        print(f"[IMAGE GENERATION] Using hardcoded prompt: {hardcoded_prompt.strip()}")

        # Start Celery task
        task = generate_design_image_task.delay(
            session_id=str(session_id),
            prompt=hardcoded_prompt.strip(),
            generation_params=shoe_spec
        )

        print(f"[IMAGE GENERATION] Task started with ID: {task.id}")

        # Send widget with task_id
        widget_payload = {
            "type": "generation_result",
            "data": {
                "task_id": task.id,
                "status": "generating"
            }
        }
    elif next_step_config["widget_type"] and next_step_config["options"]:
        # Regular step with selection widget
        widget_payload = {
            "type": next_step_config["widget_type"],
            "data": {
                "options": next_step_config["options"],
                "field": next_step_config["required_field"]  # Include field name for FE
            }
        }

    if widget_payload:
        yield await sse_event("widget", {"widget": widget_payload})
        await create_message(db, session_id, "assistant", assistant_text, {"widget": widget_payload})
    else:
        await create_message(db, session_id, "assistant", assistant_text)

    # Send State Update
    yield await sse_event("design_state", {"state": shoe_spec})

    # Done
    yield await sse_event("done", {})
