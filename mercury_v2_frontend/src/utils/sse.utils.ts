/**
 * SSE (Server-Sent Events) 스트리밍 유틸리티
 * 
 * 백엔드의 /chat/sessions/{session_id}/messages/stream 엔드포인트와 통신
 */

export interface SSEEvent {
  event: string;
  data: any;
}

export interface SSECallbacks {
  onMessageStart?: (data: { message_id: string; sequence_number: number }) => void;
  onContentDelta?: (data: { delta: string }) => void;
  onMessageComplete?: (data: { message_id: string; content: string }) => void;
  onDone?: () => void;
  onError?: (error: Error) => void;
}

/**
 * SSE 스트림을 처리하는 함수
 * @param url - SSE 엔드포인트 URL
 * @param options - fetch 옵션
 * @param callbacks - 이벤트 콜백 함수들
 */
export async function streamSSE(
  url: string,
  options: RequestInit,
  callbacks: SSECallbacks
): Promise<void> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Accept': 'text/event-stream',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Response body is not readable');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        break;
      }

      // 청크를 디코딩하고 버퍼에 추가
      buffer += decoder.decode(value, { stream: true });
      
      // 줄바꿈으로 분리
      const lines = buffer.split('\n');
      
      // 마지막 불완전한 줄은 버퍼에 보관
      buffer = lines.pop() || '';

      let currentEvent = '';
      
      for (const line of lines) {
        // 빈 줄은 이벤트 구분자
        if (line.trim() === '') {
          continue;
        }

        // event: 로 시작하는 줄
        if (line.startsWith('event: ')) {
          currentEvent = line.slice(7).trim();
        }
        
        // data: 로 시작하는 줄
        if (line.startsWith('data: ')) {
          const dataStr = line.slice(6);
          
          try {
            const data = JSON.parse(dataStr);
            
            // 이벤트 타입에 따라 콜백 호출
            switch (currentEvent) {
              case 'message_start':
                callbacks.onMessageStart?.(data);
                break;
              case 'content_delta':
                callbacks.onContentDelta?.(data);
                break;
              case 'message_complete':
                callbacks.onMessageComplete?.(data);
                break;
              case 'done':
                callbacks.onDone?.();
                break;
              default:
                console.warn('Unknown SSE event:', currentEvent, data);
            }
          } catch (e) {
            console.error('Failed to parse SSE data:', dataStr, e);
          }
          
          // 이벤트 처리 후 초기화
          currentEvent = '';
        }
      }
    }
  } catch (error) {
    callbacks.onError?.(error as Error);
    throw error;
  }
}
