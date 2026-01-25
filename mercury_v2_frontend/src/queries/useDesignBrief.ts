import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { designBriefApi } from '../api/designBrief.api';
import type { DesignBriefUpdate } from '../types/api/designBrief';

// Get Chat Brief
export const useChatBrief = (sessionId?: string) => {
  return useQuery({
    queryKey: ['designBrief', 'chat', sessionId],
    queryFn: () => designBriefApi.getChatBrief(sessionId!),
    enabled: !!sessionId,
    retry: false, // Don't retry on 404
  });
};

// Upsert Chat Brief
export const useUpsertChatBrief = (sessionId?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: DesignBriefUpdate) => designBriefApi.upsertChatBrief(sessionId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['designBrief', 'chat', sessionId] });
    },
  });
};

// Get Canvas Brief
export const useCanvasBrief = (canvasId?: string) => {
  return useQuery({
    queryKey: ['designBrief', 'canvas', canvasId],
    queryFn: () => designBriefApi.getCanvasBrief(canvasId!),
    enabled: !!canvasId,
    retry: false,
  });
};

// Upsert Canvas Brief
export const useUpsertCanvasBrief = (canvasId?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: DesignBriefUpdate) => designBriefApi.upsertCanvasBrief(canvasId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['designBrief', 'canvas', canvasId] });
    },
  });
};

// Sync Brief
export const useSyncBrief = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ canvasId, sourceChatId }: { canvasId: string; sourceChatId: string }) =>
      designBriefApi.syncBriefToCanvas(canvasId, sourceChatId),
    onSuccess: (_, { canvasId }) => {
      queryClient.invalidateQueries({ queryKey: ['designBrief', 'canvas', canvasId] });
    },
  });
};

// Get Reference Gallery
export const useReferenceGallery = () => {
    return useQuery({
        queryKey: ['gallery', 'references'],
        queryFn: () => designBriefApi.getReferenceGallery(),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};
