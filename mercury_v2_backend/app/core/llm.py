"""LLM integration utilities using LiteLLM."""
import os
from typing import AsyncGenerator
import litellm
from app.core.config import get_settings

settings = get_settings()

# Configure LiteLLM
os.environ["OPENAI_API_KEY"] = settings.OPENAI_API_KEY


SYSTEM_PROMPT = """You are Zoe, an AI assistant specialized in shoe design. 
You help designers create innovative and marketable shoe designs through conversation.

Your role:
- Ask thoughtful questions to understand the designer's vision
- Provide creative suggestions and design insights
- Guide the conversation towards concrete design specifications
- Be enthusiastic and supportive

Keep responses concise and conversational."""


async def stream_chat_completion(
    messages: list[dict[str, str]],
    model: str | None = None
) -> AsyncGenerator[str, None]:
    """
    Stream chat completion using LiteLLM.
    
    Args:
        messages: List of message dicts with 'role' and 'content'
        model: Model name (defaults to settings.OPENAI_MODEL)
    
    Yields:
        Content deltas from the LLM response
    """
    if model is None:
        model = settings.OPENAI_MODEL
    
    # Add system prompt if not present
    if not messages or messages[0]["role"] != "system":
        messages = [{"role": "system", "content": SYSTEM_PROMPT}] + messages
    
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
