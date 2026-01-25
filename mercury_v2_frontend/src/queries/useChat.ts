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
    queryKey: ['chat', 'sessions', params?.project_id, params?.page, params?.page_size],
    queryFn: () => chatApi.getSessions(params),
    refetchOnMount: true, // 컴포넌트 마운트 시 항상 새로 가져오기
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
      // 모든 세션 목록 쿼리 무효화
      queryClient.invalidateQueries({ 
        queryKey: ['chat', 'sessions'],
        exact: false  // 부분 일치로 모든 세션 쿼리 무효화
      });
    },
  });
};

// 채팅 세션 삭제
export const useDeleteChatSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) => chatApi.deleteSession(sessionId),
    onSuccess: () => {
      // 세션 목록 갱신
      queryClient.invalidateQueries({ 
        queryKey: ['chat', 'sessions'],
        exact: false
      });
    },
  });
};

// 채팅 메시지 전송
export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return {
    sendMessage: async (
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
      try {
        await chatApi.sendMessageStream(sessionId, content, {
          ...callbacks,
          onBriefRequest: callbacks.onBriefRequest, // Pass it through
          onDone: () => {
            // 메시지 전송 완료 후 쿼리 무효화
            queryClient.invalidateQueries({ 
              queryKey: ['chat', 'messages', sessionId],
              exact: false
            });
            queryClient.invalidateQueries({ 
              queryKey: ['chat', 'sessions'],
              exact: false
            });
            callbacks.onDone?.();
          },
        }, metadata);
      } catch (error) {
        callbacks.onError?.(error as Error);
      }
    },
  };
};


