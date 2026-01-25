import apiClient from './client';
import type {
  ChatSession,
  ChatSessionListResponse,
  CreateChatSessionRequest,
  ChatMessage,
} from '../types/api/chat';

export const chatApi = {
  // 채팅 세션 목록 조회
  getSessions: async (params?: { project_id?: string; page?: number; page_size?: number }) => {
    console.log('🔵 [API] getSessions called with params:', params);
    try {
      const response = await apiClient.get<ChatSessionListResponse>(
        '/chat/sessions',
        { params }
      );
      console.log('✅ [API] getSessions full response:', response.data);
      // 백엔드가 ChatSessionListResponse를 직접 반환 (data로 감싸지 않음)
      return response.data || { items: [], pagination: { page: 1, page_size: 20, total_items: 0, total_pages: 0 } };
    } catch (error) {
      console.error('❌ [API] getSessions error:', error);
      // 에러 발생 시 빈 목록 반환
      return { items: [], pagination: { page: 1, page_size: 20, total_items: 0, total_pages: 0 } };
    }
  },

  // 채팅 세션 상세 조회
  getSession: async (sessionId: string) => {
    const response = await apiClient.get<{ data: ChatSession }>(
      `/chat/sessions/${sessionId}`
    );
    return response.data.data;
  },

  // 채팅 세션 생성
  createSession: async (data: CreateChatSessionRequest) => {
    const response = await apiClient.post<{ data: ChatSession }>(
      '/chat/sessions',
      data
    );
    return response.data.data;
  },

  // 채팅 세션 삭제 (아카이브)
  deleteSession: async (sessionId: string) => {
    await apiClient.delete(`/chat/sessions/${sessionId}`);
  },

  // 채팅 메시지 목록 조회
  getMessages: async (sessionId: string, limit = 50) => {
    console.log('🔵 [API] getMessages called for session:', sessionId);
    try {
      const response = await apiClient.get<{ messages: ChatMessage[] }>(
        `/chat/sessions/${sessionId}/messages`,
        { params: { limit } }
      );
      console.log('✅ [API] getMessages response:', response.data);
      // 백엔드가 ChatMessageListResponse를 직접 반환 (data로 감싸지 않음)
      return response.data.messages || [];
    } catch (error) {
      console.error('❌ [API] getMessages error:', error);
      return [];
    }
  },

  // 채팅 메시지 전송 (SSE 스트리밍)
  sendMessageStream: async (
    sessionId: string,
    content: string,
    callbacks: {
      onMessageStart?: (data: { message_id: string; sequence_number: number }) => void;
      onContentDelta?: (data: { delta: string }) => void;
      onMessageComplete?: (data: { message_id: string; content: string }) => void;
      onBriefRequest?: (data: { message_id: string; brief_data: any; is_required: boolean }) => void;
      onDone?: () => void;
      onError?: (error: Error) => void;
    },
    metadata?: Record<string, any>
  ) => {
    const { streamSSE } = await import('../utils/sse.utils');
    const token = localStorage.getItem('accessToken');
    
    const url = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'}/chat/sessions/${sessionId}/messages/stream`;
    
    await streamSSE(
      url,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          content, 
          role: 'user',  // 백엔드에서 필수 필드
          metadata 
        }),
      },
      callbacks
    );
  },
};
