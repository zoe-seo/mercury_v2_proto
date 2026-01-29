"""LLM integration utilities using LiteLLM."""
import os
from typing import AsyncGenerator
import litellm
from app.core.config import get_settings

settings = get_settings()

# Configure LiteLLM
os.environ["OPENAI_API_KEY"] = settings.OPENAI_API_KEY


# Base system prompt for the design assistant
BASE_SYSTEM_PROMPT = """당신은 신발 디자인 전문 AI 어시스턴트 'Zoe'입니다.
디자이너와 대화하며 혁신적이고 시장성 있는 신발 디자인을 구체화하는 것을 돕습니다.

역할:
- 디자이너의 의도를 파악하기 위해 사려 깊은 질문을 던지세요.
- 창의적인 디자인 아이디어와 인사이트를 제공하세요.
- 대화를 통해 구체적인 디자인 스펙(소재, 컬러, 타겟층 등)을 도출하세요.
- 열정적이고 지지적인 태도로 대화하세요.

응답은 간결하고 자연스러운 대화체(한국어)로 작성하세요.
"""


async def stream_chat_completion(
    messages: list[dict[str, str]],
    model: str | None = None,
    system_prompt: str | None = None
) -> AsyncGenerator[str, None]:
    """
    Stream chat completion using LiteLLM.

    Args:
        messages: List of message dicts with 'role' and 'content'
        model: Model name (defaults to settings.OPENAI_MODEL)
        system_prompt: Custom system prompt (defaults to BASE_SYSTEM_PROMPT)

    Yields:
        Content deltas from the LLM response
    """
    if model is None:
        model = settings.OPENAI_MODEL

    if system_prompt is None:
        system_prompt = BASE_SYSTEM_PROMPT

    # Add system prompt if not present
    if not messages or messages[0]["role"] != "system":
        messages = [{"role": "system", "content": system_prompt}] + messages

    try:
        response = await litellm.acompletion(
            model=model,
            messages=messages,
            stream=True,
            temperature=0.7,
            max_tokens=500
        )

        async for chunk in response:
            if chunk.choices[0].delta.content:
                yield chunk.choices[0].delta.content

    except Exception as e:
        # Log error and yield error message
        print(f"LLM Error: {e}")
        yield f"[Error: {str(e)}]"


async def generate_step_response(
    conversation_history: list[dict[str, str]],
    user_input: str,
    step_instruction: str,
    context: dict
) -> AsyncGenerator[str, None]:
    """
    Generate AI response for a specific workflow step.

    Args:
        conversation_history: Previous messages in the conversation
        user_input: The user's latest input
        step_instruction: Step-specific instruction template
        context: Context variables to inject into the instruction (shoe_spec, etc.)

    Yields:
        Content deltas from the LLM response
    """
    # Format the step instruction with context
    try:
        formatted_instruction = step_instruction.format(
            user_input=user_input,
            **context
        )
    except KeyError as e:
        # If a placeholder is missing, use the instruction as-is
        formatted_instruction = step_instruction

    # Build system prompt
    system_prompt = f"{BASE_SYSTEM_PROMPT}\n\n--- Current Task ---\n{formatted_instruction}"

    # Add user's latest input to conversation
    messages = conversation_history + [{"role": "user", "content": user_input}]

    # Stream response
    async for delta in stream_chat_completion(messages, system_prompt=system_prompt):
        yield delta


def format_conversation_history(messages: list) -> list[dict[str, str]]:
    """
    Format ChatMessage objects to LLM message format.
    
    Args:
        messages: List of ChatMessage objects
    
    Returns:
        List of dicts with 'role' and 'content'
    """
    return [
        {"role": msg.role, "content": msg.content}
        for msg in messages
    ]
