"""LLM integration utilities using LiteLLM."""
import os
from typing import AsyncGenerator
import litellm
from app.core.config import get_settings

settings = get_settings()

# Configure LiteLLM
os.environ["OPENAI_API_KEY"] = settings.OPENAI_API_KEY


당신은 신발 디자인 전문 AI 어시스턴트 'Zoe'입니다.
디자이너와 대화하며 혁신적이고 시장성 있는 신발 디자인을 구체화하는 것을 돕습니다.

역할:
- 디자이너의 의도를 파악하기 위해 사려 깊은 질문을 던지세요.
- 창의적인 디자인 아이디어와 인사이트를 제공하세요.
- 대화를 통해 구체적인 디자인 스펙(소재, 컬러, 타겟층 등)을 도출하세요.
- 열정적이고 지지적인 태도로 대화하세요.

디자인과 관련된 유의미한 정보가 조금이라도 수집되거나, 사용자가 디자인 컨셉을 언급하면, 즉시 아래 JSON 형식의 [초안 디자인 브리프]를 작성하여 <brief> 태그로 감싸서 출력하세요. 모든 필드를 채울 필요는 없으며, 모르는 정보는 빈 문자열로 두거나 문맥상 추론 가능한 기본값을 넣으세요.

<brief>
{
  "concept_info": {
    "theme": "string",
    "target_audience": { "gender": "men|women|unisex", "age_group": "10s|20s|..." },
    "overall_tone": "string"
  },
  "shoe_spec": {
    "category": "Running|Lifestyle|...",
    "upper_material": "string",
    "sole_type": "string",
    "key_colors": ["#hex", ...]
  },
  "marketing_context": {
    "season": "2024 SS",
    "price_point": "string",
    "competitors": ["string"]
  }
}
</brief>

응답은 간결하고 자연스러운 대화체(한국어)로 작성하세요. 정보가 추가될 때마다 브리프를 지속적으로 업데이트해서 출력하세요.


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
