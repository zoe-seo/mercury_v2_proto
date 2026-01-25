import apiClient from './client';
import type { 
  UserProfile, 
  UserPreferences, 
  NotificationSettings,
  PasswordChangePayload 
} from '@/types/api/user';

// Response wrapper type
interface ApiResponse<T> {
  data: T;
  message: string;
}

// User Profile API
export const userApi = {
  // Get current user's full profile
  getProfile: async (): Promise<UserProfile> => {
    const response = await apiClient.get<ApiResponse<UserProfile>>('/users/me');
    return response.data.data;
  },

  // Update basic profile info (nickname, job_title, bio)
  updateProfile: async (data: {
    nickname?: string;
    job_title?: string;
    bio?: string;
  }): Promise<void> => {
    await apiClient.put('/users/me', data);
  },

  // Update user preferences
  updatePreferences: async (data: Partial<UserPreferences>): Promise<void> => {
    await apiClient.put('/users/me/preferences', data);
  },

  // Update notification settings
  updateNotifications: async (data: Partial<NotificationSettings>): Promise<void> => {
    await apiClient.put('/users/me/notifications', data);
  },

  // Upload avatar
  uploadAvatar: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<ApiResponse<{ avatar_url: string }>>(
      '/users/me/avatar',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data.avatar_url;
  },

  // Change password
  changePassword: async (data: PasswordChangePayload): Promise<void> => {
    await apiClient.put('/auth/password', data);
  },
};
