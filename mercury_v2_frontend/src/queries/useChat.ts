import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatApi } from '../api/chat.api';
import type { CreateChatSessionRequest } from '../types/api/chat';

// 채팅 세션 목록 조회
export const useChatSessions = (params?: { 
  project_id?: string; 
  page?: number; 
  page_size?: number;
}) => {
  return useQuery({
    queryKey: ['chat', 'sessions', params],
    queryFn: () => chatApi.getSessions(params),
  });
};

// 채팅 세션 상세 조회
export const useChatSession = (sessionId: string | undefined) => {
  return useQuery({
    queryKey: ['chat', 'session', sessionId],
    queryFn: () => chatApi.getSession(sessionId!),
    enabled: !!sessionId && sessionId !== 'new',
  });
};

// 채팅 메시지 목록 조회
export const useChatMessages = (sessionId: string | undefined, limit = 50) => {
  return useQuery({
    queryKey: ['chat', 'messages', sessionId, limit],
    queryFn: () => chatApi.getMessages(sessionId!, limit),
    enabled: !!sessionId,
  });
};

// 채팅 세션 생성
export const useCreateChatSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateChatSessionRequest) =>
      chatApi.createSession(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat', 'sessions'] });
    },
  });
};
