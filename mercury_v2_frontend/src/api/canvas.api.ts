import apiClient from './client';
import type {
  CanvasProject,
  CreateCanvasProjectRequest,
  UpdateCanvasProjectRequest,
  CreateLayerRequest,
  UpdateLayerRequest,
  GenerateImageRequest,
  InpaintRequest,
  TaskResponse,
} from '../types/api/canvas';

// Canvas Projects
export const canvasApi = {
  // 캔버스 프로젝트 목록 조회
  getProjects: async (page = 1, pageSize = 20) => {
    const response = await apiClient.get<{ data: { items: CanvasProject[] } }>(
      '/canvas/instances',
      { params: { page, page_size: pageSize } }
    );
    return response.data.data;
  },

  // 캔버스 프로젝트 상세 조회
  getProject: async (canvasId: string) => {
    const response = await apiClient.get<{ data: CanvasProject }>(
      `/canvas/instances/${canvasId}`
    );
    return response.data.data;
  },

  // 캔버스 프로젝트 생성
  createProject: async (data: CreateCanvasProjectRequest) => {
    const response = await apiClient.post<{ data: CanvasProject }>(
      '/canvas/instances',
      data
    );
    return response.data.data;
  },

  // 캔버스 상태 업데이트
  updateProject: async (canvasId: string, data: UpdateCanvasProjectRequest) => {
    const response = await apiClient.put<{ data: CanvasProject }>(
      `/canvas/instances/${canvasId}`,
      data
    );
    return response.data.data;
  },

  // 캔버스 프로젝트 삭제
  deleteProject: async (canvasId: string) => {
    await apiClient.delete(`/canvas/instances/${canvasId}`);
  },

  // 레이어 추가
  createLayer: async (canvasId: string, data: CreateLayerRequest) => {
    const response = await apiClient.post<{ data: any }>(
      `/canvas/instances/${canvasId}/layers`,
      data
    );
    return response.data.data;
  },

  // 레이어 수정
  updateLayer: async (
    canvasId: string,
    layerId: string,
    data: UpdateLayerRequest
  ) => {
    const response = await apiClient.put<{ data: any }>(
      `/canvas/instances/${canvasId}/layers/${layerId}`,
      data
    );
    return response.data.data;
  },

  // 레이어 삭제
  deleteLayer: async (canvasId: string, layerId: string) => {
    await apiClient.delete(`/canvas/instances/${canvasId}/layers/${layerId}`);
  },

  // Smart Segmentation 요청
  requestSegmentation: async (
    canvasId: string,
    data: { layer_id: string; click_point?: { x: number; y: number } }
  ) => {
    const response = await apiClient.post<{
      data: {
        segments: Array<{
          id: string;
          label: string;
          mask_data: { paths: any[] };
          color: string;
        }>;
      };
    }>(`/canvas/instances/${canvasId}/segment`, data);
    return response.data.data;
  },

  // Sketch-to-Image 생성
  generateImage: async (canvasId: string, data: GenerateImageRequest) => {
    const response = await apiClient.post<{ data: TaskResponse }>(
      `/canvas/instances/${canvasId}/generate`,
      data
    );
    return response.data.data;
  },

  // Inpainting (부분 수정)
  inpaintImage: async (canvasId: string, data: InpaintRequest) => {
    const response = await apiClient.post<{ data: TaskResponse }>(
      `/canvas/instances/${canvasId}/inpaint`,
      data
    );
    return response.data.data;
  },

  // 비동기 작업 상태 조회
  getTaskStatus: async (taskId: string) => {
    const response = await apiClient.get<{
      task_id: string;
      status: 'PENDING' | 'PROGRESS' | 'SUCCESS' | 'FAILURE';
      result: any;
      progress: { status: string; current: number; total: number } | null;
      error: { message: string; type: string } | null;
    }>(`/tasks/${taskId}/status`);
    return response.data;
  },
};
