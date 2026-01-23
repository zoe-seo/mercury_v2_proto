import type { CreateResourceDto, Resource, UpdateResourceDto } from '@/types/api/resource'
import apiClient from './axios'

export const resourceApi = {
  getAll: async (): Promise<Resource[]> => {
    const response = await apiClient.get('/api/resources')
    return response.data
  },

  getById: async (id: number): Promise<Resource> => {
    const response = await apiClient.get(`/api/resources/${id}`)
    return response.data
  },

  create: async (data: CreateResourceDto): Promise<Resource> => {
    const response = await apiClient.post('/api/resources', data)
    return response.data
  },

  update: async (id: number, data: UpdateResourceDto): Promise<Resource> => {
    const response = await apiClient.put(`/api/resources/${id}`, data)
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/resources/${id}`)
  },
}
