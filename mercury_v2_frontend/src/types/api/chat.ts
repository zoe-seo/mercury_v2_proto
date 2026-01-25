export interface ChatSession {
  id: string;
  title: string;
  project_id?: string;
  session_state: 'interview' | 'outline' | 'design' | 'finalized';
  created_at: string;
  updated_at: string;
  message_count?: number;
  image_count?: number;
}

export interface ChatSessionListResponse {
  items: ChatSession[];
  pagination: {
    page: number;
    page_size: number;
    total_items: number;
    total_pages: number;
  };
}

export interface CreateChatSessionRequest {
  title: string;
  project_id?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  metadata?: Record<string, any>;
  created_at: string;
  sequence_number: number;
}
