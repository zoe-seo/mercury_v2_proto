import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import type { ChatMessage } from '@/types/api/chat';
import { useSendMessage } from '@/queries/useChat';

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
  const location = useLocation();
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>(messages);
  const [isTyping, setIsTyping] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [currentMessageId, setCurrentMessageId] = useState<string | null>(null);
  const hasAutoSentRef = useRef(false);
  
  const { sendMessage } = useSendMessage();

  // Update local messages when prop changes
  useEffect(() => {
    setLocalMessages(messages);
  }, [messages]);

  // 세션 생성 직후 첫 메시지 자동 전송
  useEffect(() => {
    const firstMessage = (location.state as any)?.firstMessage;
    
    if (sessionId && firstMessage && !hasAutoSentRef.current) {
      hasAutoSentRef.current = true;
      // 약간의 딜레이 후 메시지 전송 (세션이 완전히 생성되도록)
      setTimeout(() => {
        handleSendMessage(firstMessage);
      }, 100);
    }
  }, [sessionId, location.state]);

  const handleSendMessage = async (content: string) => {
    // 세션이 없으면 첫 메시지로 세션 생성
    if (!sessionId && onFirstMessage) {
      onFirstMessage(content);
      return;
    }

    if (!sessionId) {
      console.error('No session ID available');
      return;
    }

    // 사용자 메시지를 로컬 상태에 추가
    const userMessage: ChatMessage = {
      id: `temp-user-${Date.now()}`,
      role: 'user',
      content,
      created_at: new Date().toISOString(),
      sequence_number: localMessages.length + 1,
    };

    setLocalMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);
    setStreamingContent('');
    setCurrentMessageId(null);

    // SSE 스트리밍으로 메시지 전송
    await sendMessage(
      sessionId,
      content,
      {
        onMessageStart: (data) => {
          console.log('Message started:', data);
          setCurrentMessageId(data.message_id);
          setStreamingContent('');
        },
        onContentDelta: (data) => {
          // 스트리밍 중인 내용을 누적
          setStreamingContent((prev) => prev + data.delta);
        },
        onMessageComplete: (data) => {
          console.log('Message completed:', data);
          
          // 완성된 AI 메시지를 로컬 상태에 추가
          const aiMessage: ChatMessage = {
            id: data.message_id,
            role: 'assistant',
            content: data.content,
            created_at: new Date().toISOString(),
            sequence_number: localMessages.length + 2,
          };
          
          setLocalMessages((prev) => [...prev, aiMessage]);
          setStreamingContent('');
          setCurrentMessageId(null);
        },
        onDone: () => {
          console.log('Stream done');
          setIsTyping(false);
        },
        onError: (error) => {
          console.error('Stream error:', error);
          setIsTyping(false);
          setStreamingContent('');
          setCurrentMessageId(null);
          
          // 에러 메시지 표시
          const errorMessage: ChatMessage = {
            id: `error-${Date.now()}`,
            role: 'assistant',
            content: `죄송합니다. 메시지 전송 중 오류가 발생했습니다: ${error.message}`,
            created_at: new Date().toISOString(),
            sequence_number: localMessages.length + 2,
          };
          setLocalMessages((prev) => [...prev, errorMessage]);
        },
      }
    );
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

  // 스트리밍 중인 메시지를 포함한 전체 메시지 목록
  const displayMessages = [...localMessages];
  if (streamingContent && currentMessageId) {
    displayMessages.push({
      id: currentMessageId,
      role: 'assistant',
      content: streamingContent,
      created_at: new Date().toISOString(),
      sequence_number: localMessages.length + 1,
    });
  }

  return (
    <div className="flex flex-col h-full">
      <MessageList messages={displayMessages} isTyping={isTyping && !streamingContent} />
      <ChatInput 
        onSendMessage={handleSendMessage} 
        disabled={isTyping || isCreatingSession} 
      />
    </div>
  );
};

