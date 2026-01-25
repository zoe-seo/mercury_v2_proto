import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { canvasApi } from '../api/canvas.api';
import type {
  CreateCanvasProjectRequest,
  UpdateCanvasProjectRequest,
  CreateLayerRequest,
  UpdateLayerRequest,
  GenerateImageRequest,
  InpaintRequest,
} from '../types/api/canvas';

// 캔버스 프로젝트 목록 조회
export const useCanvasProjects = (params?: { page?: number; page_size?: number }) => {
  const page = params?.page || 1;
  const pageSize = params?.page_size || 20;

  return useQuery({
    queryKey: ['canvas', 'projects', page, pageSize],
    queryFn: () => canvasApi.getProjects(page, pageSize),
  });
};

// 캔버스 프로젝트 상세 조회
export const useCanvasProject = (canvasId: string | undefined) => {
  return useQuery({
    queryKey: ['canvas', 'project', canvasId],
    queryFn: () => canvasApi.getProject(canvasId!),
    enabled: !!canvasId && canvasId !== 'new',
  });
};

// 캔버스 프로젝트 생성
export const useCreateCanvasProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCanvasProjectRequest) =>
      canvasApi.createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['canvas', 'projects'] });
    },
  });
};

// 캔버스 프로젝트 업데이트
export const useUpdateCanvasProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      canvasId,
      data,
    }: {
      canvasId: string;
      data: UpdateCanvasProjectRequest;
    }) => canvasApi.updateProject(canvasId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['canvas', 'project', variables.canvasId],
      });
    },
  });
};

// 캔버스 프로젝트 삭제
export const useDeleteCanvasProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (canvasId: string) => canvasApi.deleteProject(canvasId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['canvas', 'projects'] });
    },
  });
};

// 레이어 생성
export const useCreateLayer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      canvasId,
      data,
    }: {
      canvasId: string;
      data: CreateLayerRequest;
    }) => canvasApi.createLayer(canvasId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['canvas', 'project', variables.canvasId],
      });
    },
  });
};

// 레이어 업데이트
export const useUpdateLayer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      canvasId,
      layerId,
      data,
    }: {
      canvasId: string;
      layerId: string;
      data: UpdateLayerRequest;
    }) => canvasApi.updateLayer(canvasId, layerId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['canvas', 'project', variables.canvasId],
      });
    },
  });
};

// 레이어 삭제
export const useDeleteLayer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      canvasId,
      layerId,
    }: {
      canvasId: string;
      layerId: string;
    }) => canvasApi.deleteLayer(canvasId, layerId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['canvas', 'project', variables.canvasId],
      });
    },
  });
};

// Smart Segmentation
export const useSegmentation = () => {
  return useMutation({
    mutationFn: ({
      canvasId,
      layerId,
      clickPoint,
    }: {
      canvasId: string;
      layerId: string;
      clickPoint?: { x: number; y: number };
    }) =>
      canvasApi.requestSegmentation(canvasId, {
        layer_id: layerId,
        click_point: clickPoint,
      }),
  });
};

// 이미지 생성
export const useGenerateImage = () => {
  return useMutation({
    mutationFn: ({
      canvasId,
      data,
    }: {
      canvasId: string;
      data: GenerateImageRequest;
    }) => canvasApi.generateImage(canvasId, data),
  });
};

// Inpainting
export const useInpaintImage = () => {
  return useMutation({
    mutationFn: ({
      canvasId,
      data,
    }: {
      canvasId: string;
      data: InpaintRequest;
    }) => canvasApi.inpaintImage(canvasId, data),
  });
};

// 비동기 작업 상태 폴링
export const useTaskStatus = (taskId: string | null, enabled = true) => {
  return useQuery({
    queryKey: ['task', 'status', taskId],
    queryFn: () => canvasApi.getTaskStatus(taskId!),
    enabled: !!taskId && enabled,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      // SUCCESS 또는 FAILURE 상태가 되면 폴링 중지
      if (status === 'SUCCESS' || status === 'FAILURE') {
        return false;
      }
      // 3초마다 폴링
      return 3000;
    },
  });
};
