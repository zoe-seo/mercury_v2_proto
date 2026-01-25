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
    const response = await apiClient.get<{ data: ChatSessionListResponse }>(
      '/chat/sessions',
      { params }
    );
    return response.data.data;
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

  // 채팅 메시지 목록 조회
  getMessages: async (sessionId: string, limit = 50) => {
    const response = await apiClient.get<{ data: { messages: ChatMessage[] } }>(
      `/chat/sessions/${sessionId}/messages`,
      { params: { limit } }
    );
    return response.data.data.messages;
  },
};
