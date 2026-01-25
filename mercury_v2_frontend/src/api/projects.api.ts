import apiClient from './client';
import type {
  Project,
  ProjectListResponse,
  CreateProjectRequest,
  UpdateProjectRequest,
  DesignItem,
} from '../types/api/projects';

export const projectsApi = {
  // 프로젝트 목록 조회
  getProjects: async (page = 1, pageSize = 20) => {
    const response = await apiClient.get<{ data: ProjectListResponse }>(
      '/projects',
      { params: { page, page_size: pageSize } }
    );
    return response.data.data;
  },

  // 프로젝트 상세 조회
  getProject: async (projectId: string) => {
    const response = await apiClient.get<{ data: Project }>(
      `/projects/${projectId}`
    );
    return response.data.data;
  },

  // 프로젝트 생성
  createProject: async (data: CreateProjectRequest) => {
    const response = await apiClient.post<{ data: Project }>(
      '/projects',
      data
    );
    return response.data.data;
  },

  // 프로젝트 수정
  updateProject: async (projectId: string, data: UpdateProjectRequest) => {
    const response = await apiClient.put<{ data: Project }>(
      `/projects/${projectId}`,
      data
    );
    return response.data.data;
  },

  // 프로젝트 삭제
  deleteProject: async (projectId: string) => {
    await apiClient.delete(`/projects/${projectId}`);
  },

  // 최근 작업 내역 조회
  getRecentDesigns: async (limit = 10) => {
    const response = await apiClient.get<{ data: { items: DesignItem[] } }>(
      '/projects/recent-designs',
      { params: { limit } }
    );
    return response.data.data.items;
  },
};
