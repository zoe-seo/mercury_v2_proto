export interface Project {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  design_count: number;
}

export interface ProjectListResponse {
  items: Project[];
  pagination: {
    page: number;
    page_size: number;
    total_items: number;
    total_pages: number;
  };
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
}

// Unified Design Type for UI (Recent Designs)
export type DesignType = 'canvas' | 'chat';

export interface DesignItem {
  id: string;
  type: DesignType;
  title: string;
  description?: string; // Chat's first message or Canvas description
  thumbnail_url?: string;
  updated_at: string;
  project_id?: string;
  project_name?: string; // For display
}
