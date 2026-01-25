import apiClient from './client';
import type { DesignBrief, DesignBriefUpdate } from '../types/api/designBrief';
import type { ReferenceGalleryResponse } from '../types/api/gallery';

export const designBriefApi = {
  // Get Chat Brief
  getChatBrief: async (sessionId: string) => {
    const response = await apiClient.get<{ data: DesignBrief }>(
      `/chat/sessions/${sessionId}/brief`
    );
    return response.data.data;
  },

  // Upsert Chat Brief
  upsertChatBrief: async (sessionId: string, data: DesignBriefUpdate) => {
    const response = await apiClient.put<{ data: DesignBrief }>(
      `/chat/sessions/${sessionId}/brief`,
      data
    );
    return response.data.data;
  },

  // Get Canvas Brief
  getCanvasBrief: async (canvasId: string) => {
    const response = await apiClient.get<{ data: DesignBrief }>(
      `/canvas/instances/${canvasId}/brief`
    );
    return response.data.data;
  },

  // Upsert Canvas Brief
  upsertCanvasBrief: async (canvasId: string, data: DesignBriefUpdate) => {
    const response = await apiClient.put<{ data: DesignBrief }>(
      `/canvas/instances/${canvasId}/brief`,
      data
    );
    return response.data.data;
  },

  // Sync Brief to Canvas
  syncBriefToCanvas: async (canvasId: string, sourceChatSessionId: string) => {
    const response = await apiClient.post<{ data: DesignBrief }>(
      `/canvas/instances/${canvasId}/brief/sync`,
      { source_chat_session_id: sourceChatSessionId }
    );
    return response.data.data;
  },

  // Get Reference Gallery
  getReferenceGallery: async () => {
    const response = await apiClient.get<ReferenceGalleryResponse>(
      '/gallery/references'
    );
    return response.data;
  },
};
