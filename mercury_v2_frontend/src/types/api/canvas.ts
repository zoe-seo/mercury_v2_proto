export interface CanvasProject {
  id: string;
  name: string;
  project_id?: string;
  canvas_state: CanvasState;
  layers?: CanvasLayer[];
  created_at: string;
  updated_at: string;
  thumbnail_url?: string;
}

export interface CanvasState {
  viewport: {
    x: number;
    y: number;
    zoom: number;
  };
}

export type LayerType = 'sketch' | 'image' | 'text' | 'group' | 'generated' | 'shape';

export interface CanvasLayer {
  id: string;
  layer_type: LayerType;
  layer_data: Record<string, any>; // Flexible for fabric object data
  z_index: number;
  is_visible: boolean;
  is_locked?: boolean;
  opacity?: number;
  name?: string;
}

export interface CreateCanvasProjectRequest {
  name: string;
  project_id?: string;
}

export interface UpdateCanvasProjectRequest {
  canvas_state?: CanvasState;
  name?: string;
}

export interface CreateLayerRequest {
  layer_type: LayerType;
  layer_data: Record<string, any>;
  z_index: number;
}

export interface UpdateLayerRequest {
  layer_data?: Record<string, any>;
  is_visible?: boolean;
  z_index?: number;
}

export interface GenerateImageRequest {
  layer_ids: string[];
  prompt: string;
  generation_params: {
    strength: number;
    steps: number;
    guidance_scale: number;
  };
}

export interface InpaintRequest {
  layer_id: string;
  mask_data: Record<string, any>;
  prompt: string;
  generation_params: {
    strength: number;
  };
}

export interface TaskResponse {
  task_id: string;
  status: 'processing' | 'completed' | 'failed';
}
