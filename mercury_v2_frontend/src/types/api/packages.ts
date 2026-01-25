export interface DesignPackage {
  id: string;
  title: string;
  description: string;
  source_type: 'chat' | 'canvas';
  source_id: string;
  status: 'partial' | 'generating_report' | 'completed' | 'failed';
  project_id?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateDesignPackageRequest {
  source_type: 'chat' | 'canvas';
  source_id: string;
  title: string;
  description: string;
  selected_image_ids: string[];
  context?: {
    brand_name?: string;
    keywords?: string[];
    [key: string]: any;
  };
}

export interface CreateDesignPackageResponse {
  design_package_id: string;
  status: string;
  message: string;
  estimated_time?: string;
}

export interface Production2DRequest {
  views?: string[]; // ['front', 'back', 'left', 'right', 'top', 'bottom']
  include_lifestyle?: boolean;
}

export interface Production2DResponse {
  task_id: string;
  status: 'processing' | 'completed' | 'failed';
  views_requested: string[];
}

export interface Production3DRequest {
  format?: 'glb' | 'fbx' | 'obj';
  quality?: 'low' | 'medium' | 'high';
}

export interface Production3DResponse {
  task_id: string;
  status: 'processing' | 'completed' | 'failed';
  estimated_time?: string;
}

export interface FinalizePackageResponse {
  design_package_id: string;
  status: 'completed';
  gallery_url: string;
}
