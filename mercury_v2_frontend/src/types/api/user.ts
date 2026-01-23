// Auth-related types
export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

// User Profile types (more detailed than auth User)
export interface UserStats {
  projects_count: number;
}

export type ShoeSizeSystem = 'US' | 'UK' | 'EU' | 'MM';
export type GenderCategory = 'mens' | 'womens' | 'unisex' | 'kids';
export type StyleTag = 'minimalist' | 'futuristic' | 'retro' | 'streetwear' | 'luxury' | 'performance';

export interface UserPreferences {
  shoe_size_system: ShoeSizeSystem;
  gender_category: GenderCategory;
  style_tags: StyleTag[];
  theme?: 'dark' | 'light' | 'system';
}

export interface NotificationSettings {
  email_creation_finished: boolean;
  email_weekly_report: boolean;
  app_browser_notification: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  nickname: string;
  job_title: string;
  bio: string;
  avatar_url: string;
  stats: UserStats;
  preferences: UserPreferences;
  notification_settings: NotificationSettings;
}

export interface PasswordChangePayload {
  current_password: string;
  new_password: string;
  confirm_password: string;
}
