import { useRef, useEffect } from 'react';
import type { Message } from '@/types/richChat';
import { RichMessageBubble } from './RichMessageBubble';
import { Send } from 'lucide-react';
import { useState } from 'react';

interface RichChatAreaProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  onWidgetSelect: (messageId: string, value: any) => void;
  isTyping?: boolean;
}

export const RichChatArea = ({ messages, onSendMessage, onWidgetSelect, isTyping }: RichChatAreaProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState('');

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    onSendMessage(inputValue);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Empty State (메시지가 없을 때)
  if (messages.length === 0) {
    return (
      <div className="flex flex-col h-full bg-white relative">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-2xl px-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              어떤 신발 디자인을 만들어볼까요?
            </h2>
            <p className="text-gray-500 mb-8">
              Mercury와 대화하며 완벽한 신발 디자인을 만들어보세요
            </p>
            
            {/* Quick Start Buttons */}
            <div className="flex flex-wrap gap-3 justify-center mb-8">
              <button
                onClick={() => onSendMessage("미래적인 느낌의 네온 러닝화")}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
              >
                미래적인 느낌의 네온 러닝화
              </button>
              <button
                onClick={() => onSendMessage("90년대 스타일의 빈티지 부츠")}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
              >
                90년대 스타일의 빈티지 부츠
              </button>
              <button
                onClick={() => onSendMessage("심플한 화이트 스니커즈")}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
              >
                심플한 화이트 스니커즈
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-100 p-4 bg-white">
          <div className="max-w-5xl mx-auto relative">
            <input
              type="text"
              className="w-full pl-6 pr-14 py-4 rounded-full border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none shadow-sm text-base transition-all"
              placeholder="디자인 아이디어를 입력하세요..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button 
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className={`
                absolute right-2 top-2 p-2 rounded-full transition-colors
                ${inputValue.trim() 
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              <Send size={20} />
            </button>
          </div>
          <p className="text-center text-xs text-gray-400 mt-2">
            AI는 실수할 수 있습니다. 생성된 디자인을 주의깊게 확인해주세요.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white relative">
      <div className="flex-1 overflow-y-auto p-4 md:p-6" ref={scrollRef}>
        <div className="max-w-5xl mx-auto">
          {messages.map((msg, index) => (
            <RichMessageBubble 
              key={msg.id} 
              message={msg} 
              isLatest={index === messages.length - 1} 
              onWidgetSelect={onWidgetSelect}
            />
          ))}
          
          {isTyping && (
            <div className="flex justify-start mb-4">
               <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce mx-1" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
               </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Area - Only Shown for Step 0 or if we allow manual override */}
      {/* For MVP, we always show it but maybe disabled or placeholder changes */}
      <div className="border-t border-gray-100 p-4 bg-white">
        <div className="max-w-5xl mx-auto relative">
          <input
            type="text"
            className="w-full pl-6 pr-14 py-4 rounded-full border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none shadow-sm text-base transition-all"
            placeholder="디자인 아이디어를 입력하세요..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button 
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className={`
              absolute right-2 top-2 p-2 rounded-full transition-colors
              ${inputValue.trim() 
                ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            <Send size={20} />
          </button>
        </div>
        <p className="text-center text-xs text-gray-400 mt-2">
          AI는 실수할 수 있습니다. 생성된 디자인을 주의깊게 확인해주세요.
        </p>
      </div>
    </div>
  );
};
