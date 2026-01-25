import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UserPreferences, NotificationSettings } from '@/types/api/user';
import { userApi } from '@/api/user.api';

export const useProfile = () => {
  return useQuery({
    queryKey: ['user', 'me'],
    queryFn: () => userApi.getProfile(),
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates: {
      nickname?: string;
      job_title?: string;
      bio?: string;
      preferences?: Partial<UserPreferences>;
      notification_settings?: Partial<NotificationSettings>;
    }) => {
      // Split updates into separate API calls based on what's being updated
      const promises: Promise<void>[] = [];

      // Update basic profile info
      if (updates.nickname !== undefined || updates.job_title !== undefined || updates.bio !== undefined) {
        promises.push(
          userApi.updateProfile({
            nickname: updates.nickname,
            job_title: updates.job_title,
            bio: updates.bio,
          })
        );
      }

      // Update preferences
      if (updates.preferences) {
        promises.push(userApi.updatePreferences(updates.preferences));
      }

      // Update notifications
      if (updates.notification_settings) {
        promises.push(userApi.updateNotifications(updates.notification_settings));
      }

      return Promise.all(promises).then(() => undefined);
    },
    onSuccess: () => {
      // Invalidate and refetch profile
      queryClient.invalidateQueries({ queryKey: ['user', 'me'] });
    },
  });
};

export const useUploadAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => userApi.uploadAvatar(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'me'] });
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: userApi.changePassword,
  });
};

