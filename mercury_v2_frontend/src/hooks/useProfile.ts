import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UserProfile } from '@/types/api/user';
import { MOCK_USER } from '@/mocks/data/user';

// Local mutable copy for mock updates
let mockUserData: UserProfile = { ...MOCK_USER };

// Mock API Call
const fetchProfile = async (): Promise<UserProfile> => {
  await new Promise((resolve) => setTimeout(resolve, 600)); 
  return mockUserData;
};

// Mock Update Call
const updateProfile = async (updates: Partial<UserProfile>): Promise<UserProfile> => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  // Deep merge simulation for nested objects
  mockUserData = {
    ...mockUserData,
    ...updates,
    preferences: { ...mockUserData.preferences, ...updates.preferences },
    notification_settings: { ...mockUserData.notification_settings, ...updates.notification_settings },
  };
  return mockUserData;
};

export const useProfile = () => {
  return useQuery({
    queryKey: ['user', 'me'],
    queryFn: fetchProfile,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['user', 'me'], updatedUser);
    },
  });
};
