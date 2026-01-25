import { useState, useEffect } from 'react';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import type { ChatMessage } from '@/types/api/chat';

interface ChatAreaProps {
  sessionId?: string;
  messages?: ChatMessage[];
  isCreatingSession?: boolean;
  onFirstMessage?: (content: string) => void;
}

export const ChatArea = ({ 
  sessionId, 
  messages = [], 
  isCreatingSession = false,
  onFirstMessage 
}: ChatAreaProps) => {
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>(messages);
  const [isTyping, setIsTyping] = useState(false);

  // Update local messages when prop changes
  useEffect(() => {
    setLocalMessages(messages);
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    // 세션이 없으면 첫 메시지로 세션 생성
    if (!sessionId && onFirstMessage) {
      onFirstMessage(content);
      return;
    }

    // 기존 세션에 메시지 추가 (임시 로컬 상태)
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      created_at: new Date().toISOString(),
      sequence_number: localMessages.length + 1,
    };

    setLocalMessages((prev) => [...prev, newMessage]);
    setIsTyping(true);

    // TODO: 실제 API 호출로 메시지 전송
    // await sendMessage(sessionId, content);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I received your request: "${content}". This is a simulated response.`,
        created_at: new Date().toISOString(),
        sequence_number: localMessages.length + 2,
      };
      setLocalMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  // Empty State (세션이 없을 때)
  if (!sessionId && localMessages.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-2xl px-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What shoe design are you dreaming of today?
            </h2>
            <p className="text-gray-500 mb-8">
              Start a conversation with AI to create your perfect shoe design
            </p>
            
            {/* Prompt Chips */}
            <div className="flex flex-wrap gap-3 justify-center mb-8">
              <button
                onClick={() => handleSendMessage("Futuristic running shoes with neon lights")}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
              >
                Futuristic running shoes with neon lights
              </button>
              <button
                onClick={() => handleSendMessage("Vintage leather boots, 90s style")}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
              >
                Vintage leather boots, 90s style
              </button>
              <button
                onClick={() => handleSendMessage("Minimalist white sneakers")}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
              >
                Minimalist white sneakers
              </button>
            </div>
          </div>
        </div>
        
        <ChatInput 
          onSendMessage={handleSendMessage} 
          disabled={isCreatingSession} 
          placeholder={isCreatingSession ? "Creating session..." : "Describe your design idea..."}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <MessageList messages={localMessages} isTyping={isTyping} />
      <ChatInput 
        onSendMessage={handleSendMessage} 
        disabled={isTyping || isCreatingSession} 
      />
    </div>
  );
};
