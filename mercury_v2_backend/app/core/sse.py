"""SSE streaming utilities for real-time responses."""
import json
from typing import AsyncGenerator


async def sse_event(event: str, data: dict | str) -> str:
    """
    Format data as Server-Sent Event.
    
    Args:
        event: Event type (e.g., 'message_start', 'content_delta', 'done')
        data: Event data (dict or string)
    
    Returns:
        Formatted SSE string
    """
    if isinstance(data, dict):
        data_str = json.dumps(data, ensure_ascii=False)
    else:
        data_str = data
    
    return f"event: {event}\ndata: {data_str}\n\n"


async def stream_sse_response(
    message_id: str,
    sequence_number: int,
    content_generator: AsyncGenerator[str, None]
) -> AsyncGenerator[str, None]:
    """
    Stream SSE events for a chat message.
    
    Args:
        message_id: ID of the message being streamed
        sequence_number: Sequence number of the message
        content_generator: Async generator yielding content deltas
    
    Yields:
        SSE formatted strings
    """
    # Send message start event
    yield await sse_event("message_start", {
        "message_id": message_id,
        "sequence_number": sequence_number
    })
    
    # Collect full content while streaming
    full_content = ""
    
    # Stream content deltas
    async for delta in content_generator:
        full_content += delta
        yield await sse_event("content_delta", {"delta": delta})
    
    # Send message complete event
    yield await sse_event("message_complete", {
        "message_id": message_id,
        "content": full_content
    })
    
    # Send done event
    yield await sse_event("done", {})
