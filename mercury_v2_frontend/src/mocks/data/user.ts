import type { UserProfile } from '@/types/api/user';

// Mock User Data
export const MOCK_USER: UserProfile = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  email: 'sara.kim@mercury.design',
  name: 'Sara Kim',
  nickname: 'sara_design',
  job_title: 'Senior Product Designer',
  bio: 'Passionate about creating intuitive and beautiful user experiences. Specializing in footwear design and 3D modeling.',
  avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&auto=format&fit=crop',
  stats: {
    projects_count: 14,
  },
  preferences: {
    shoe_size_system: 'US',
    gender_category: 'unisex',
    style_tags: ['minimalist', 'performance'],
    theme: 'system',
  },
  notification_settings: {
    email_creation_finished: true,
    email_weekly_report: false,
    app_browser_notification: true,
  }
};
