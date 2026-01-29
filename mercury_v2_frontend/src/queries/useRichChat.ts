import type { Message, ChatSession } from '@/types/richChat';
import { api } from '@/utils/api';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const useRichChatSessions = () => {
    return useQuery({
        queryKey: ['rich-chat-sessions'],
        queryFn: async () => {
            const { data } = await api.get('/api/v1/chat/sessions');
            return data.items; // ChatSessionResponse[]
        }
    });
};

export const useRichChatSession = (sessionId?: string) => {
  return useQuery({
    queryKey: ['rich-chat-session', sessionId],
    queryFn: async () => {
      if (!sessionId) return null;
      const { data } = await api.get(`/api/v1/chat/sessions/${sessionId}`);
      return data; // SessionHistoryResponse
    },
    enabled: !!sessionId,
    staleTime: 1000 * 60,
  });
};

export const useCreateRichChatSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (initialMessage: string) => {
      const { data } = await api.post('/api/v1/chat/sessions', {
        initial_message: initialMessage,
        title: initialMessage.slice(0, 50) || "New Chat"
      });
      return data.data; // ChatSessionResponse
    },
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['rich-chat-sessions'] });
    }
  });
};

type StreamCallbacks = {
  onUserMessage: (msg: Message) => void;
  onTextDelta: (delta: string) => void;
  onWidget: (widget: any) => void;
  onDesignState: (state: any) => void;
  onDone: () => void;
  onError: (err: any) => void;
};

export const useStreamRichMessage = () => {
  const queryClient = useQueryClient();

  const sendMessage = async (sessionId: string, action: { type: 'text' | 'selection', content: any }, callbacks: StreamCallbacks) => {
    try {
      const token = localStorage.getItem('accessToken'); 
      
      const response = await fetch(`${BASE_URL}/chat/sessions/${sessionId}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'text/event-stream'
        },
        body: JSON.stringify(action)
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;
        
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || ''; 
        
        for (const line of lines) {
           const eventMatch = line.match(/^event: (.+)$/m);
           const dataMatch = line.match(/^data: (.+)$/m);
           
           if (eventMatch && dataMatch) {
             const eventType = eventMatch[1].trim();
             const dataStr = dataMatch[1].trim();
             
             try {
                const data = JSON.parse(dataStr);
                
                switch (eventType) {
                  case 'user_message':
                    callbacks.onUserMessage({
                      id: data.id,
                      role: 'user',
                      content: data.content,
                      timestamp: new Date().toISOString()
                    });
                    break;
                    
                  case 'text_delta':
                    callbacks.onTextDelta(data.delta);
                    break;
                    
                  case 'widget':
                    callbacks.onWidget(data.widget);
                    break;
                    
                  case 'design_state':
                    callbacks.onDesignState(data.state);
                    break;
                    
                  case 'done':
                    callbacks.onDone();
                    queryClient.invalidateQueries({ queryKey: ['rich-chat-session', sessionId] });
                    // Also refetch list to update last message snippet if we had one
                    queryClient.invalidateQueries({ queryKey: ['rich-chat-sessions'] });
                    return;
                }
             } catch (e) {
                console.error("Failed to parse SSE data", e);
             }
           }
        }
      }
    } catch (error) {
      callbacks.onError(error);
    }
  };

  return { sendMessage };
};
