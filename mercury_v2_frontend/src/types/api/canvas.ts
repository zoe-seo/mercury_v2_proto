export interface CanvasInstance {
  id: string;
  name: string;
  project_id?: string;
  canvas_state: {
    viewport: {
      x: number;
      y: number;
      zoom: number;
    };
  };
  thumbnail_url: string;
  created_at: string;
  updated_at: string;
  layers?: CanvasLayer[];
}

export type CanvasProject = CanvasInstance;

export type LayerType = 'sketch' | 'image' | 'text';

export type ImageSource = 'upload' | 'ai_generated' | 'chat_import';

export interface BaseLayer {
  id: string;
  layer_type: LayerType;
  z_index: number;
  is_visible: boolean;
  is_locked?: boolean;
  opacity?: number;
  name?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SketchLayerData {
  paths: any[]; // Fabric.js path objects
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  fabric_json?: any;
}

export interface SketchLayer extends BaseLayer {
  layer_type: 'sketch';
  layer_data: SketchLayerData;
}

export interface ImageLayerData {
  image_url: string;
  source: ImageSource;
  x: number;
  y: number;
  width: number;
  height: number;
  scale_x?: number;
  scale_y?: number;
  rotation?: number;
  
  // AI Generated
  parent_layer_id?: string;
  prompt?: string;
  generation_params?: {
    strength?: number;
    steps?: number;
    guidance_scale?: number;
    model?: string;
  };
  reference_layer_ids?: string[];
  
  // Chat Import
  chat_message_id?: string;
  
  fabric_json?: any;
}

export interface ImageLayer extends BaseLayer {
  layer_type: 'image';
  layer_data: ImageLayerData;
}

export interface TextLayerData {
  text: string;
  x: number;
  y: number;
  font_family?: string;
  font_size?: number;
  fill?: string;
  width?: number;
  height?: number;
  fabric_json?: any;
}

export interface TextLayer extends BaseLayer {
  layer_type: 'text';
  layer_data: TextLayerData;
}

export type CanvasLayer = SketchLayer | ImageLayer | TextLayer;

export interface Segment {
  id: string;
  label: string;
  mask_data: {
    paths: any[];
  };
  color: string;
}

export interface SegmentationResult {
  segments: Segment[];
}

export interface AsyncTaskResponse {
  task_id: string;
  status: 'processing' | 'completed' | 'failed';
  progress?: number;
  result?: any;
  error?: any;
}

export interface TaskResponse {
    task_id: string;
    status: 'PENDING' | 'PROGRESS' | 'SUCCESS' | 'FAILURE';
}

// Request DTOs
export interface CreateCanvasProjectRequest {
  name: string;
  project_id?: string;
}

export interface UpdateCanvasProjectRequest {
  name?: string;
  canvas_state?: {
    viewport: {
      x: number;
      y: number;
      zoom: number;
    };
  };
}

export interface CreateLayerRequest {
  layer_type: LayerType;
  layer_data: SketchLayerData | ImageLayerData | TextLayerData;
  z_index: number;
}

export interface UpdateLayerRequest {
  layer_data?: Partial<SketchLayerData | ImageLayerData | TextLayerData>;
  is_visible?: boolean;
  is_locked?: boolean;
  opacity?: number;
  z_index?: number;
}

export interface GenerateImageRequest {
  layer_ids: string[];
  prompt: string;
  generation_params?: {
    strength?: number;
    steps?: number;
    guidance_scale?: number;
    model?: string;
  };
}

export interface InpaintRequest {
  layer_id: string;
  mask_data: {
    paths: any[];
  };
  prompt: string;
  generation_params?: {
    strength?: number;
  };
}

export type ShapeType = 'rect' | 'circle' | 'polygon' | 'line';