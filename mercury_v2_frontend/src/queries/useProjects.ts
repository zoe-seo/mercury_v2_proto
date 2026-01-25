import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsApi } from '../api/projects.api';
import type {
  CreateProjectRequest,
  UpdateProjectRequest,
} from '../types/api/projects';

// 프로젝트 목록 조회
export const useProjects = (params?: { page?: number; page_size?: number }) => {
  const page = params?.page || 1;
  const pageSize = params?.page_size || 20;

  return useQuery({
    queryKey: ['projects', page, pageSize],
    queryFn: () => projectsApi.getProjects(page, pageSize),
  });
};

// 프로젝트 상세 조회
export const useProject = (projectId: string | undefined) => {
  return useQuery({
    queryKey: ['project', projectId],
    queryFn: () => projectsApi.getProject(projectId!),
    enabled: !!projectId,
  });
};

// 최근 작업 내역 조회
export const useRecentDesigns = (limit = 10) => {
  return useQuery({
    queryKey: ['projects', 'recent', limit],
    queryFn: () => projectsApi.getRecentDesigns(limit),
  });
};

// 프로젝트 생성
export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProjectRequest) =>
      projectsApi.createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

// 프로젝트 수정
export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      data,
    }: {
      projectId: string;
      data: UpdateProjectRequest;
    }) => projectsApi.updateProject(projectId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['project', variables.projectId],
      });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

// 프로젝트 삭제
export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) => projectsApi.deleteProject(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};
