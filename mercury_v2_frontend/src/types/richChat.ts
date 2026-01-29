export type Role = 'user' | 'assistant' | 'system';

export type WidgetType = 'selection_card' | 'chip_group' | 'color_picker' | 'generation_result';

export interface WidgetOption {
  id: string;
  label: string;
  value?: string;
  image_url?: string;
  is_selected?: boolean;
}

export interface WidgetData {
  options?: WidgetOption[];
  multi_select?: boolean;
  palette?: string[];
  selected_colors?: string[];
  main_image_url?: string;
  variations?: string[];
  field?: string; // Field name for selection (e.g., "outline_id", "target_user")
  task_id?: string; // Celery task ID for generation_result widget
  status?: string; // Generation status: generating | completed | failed
}

export interface Widget {
  type: WidgetType;
  data: WidgetData;
}

export interface Message {
  id: string;
  role: Role;
  content: string; // The text part
  widget?: Widget | null; // The attached interactive part
  timestamp?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  updated_at: string;
  thumbnail_url?: string;
  current_step?: string;
}

// For state sync
export interface ShoeSpec {
  target_user?: 'men' | 'women' | 'unisex';
  use_case?: string;
  outline_id?: string;
  sole_id?: string;
  colors?: string[];
  materials?: string[];
  style_keywords?: string[];
}
