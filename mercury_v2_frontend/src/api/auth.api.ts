import apiClient from './client';
import type { User } from '@/types/api/user';

export interface AuthResponse {
  user: User;
  access_token: string;
  token_type: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export const authApi = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<{ data: AuthResponse }>('/auth/login', credentials);
    return response.data.data;
  },

  signup: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<{ data: AuthResponse }>('/auth/signup', data);
    return response.data.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },
  
  getMe: async (): Promise<User> => {
    const response = await apiClient.get<{ data: User }>('/auth/me');
    return response.data.data;
  }
};
