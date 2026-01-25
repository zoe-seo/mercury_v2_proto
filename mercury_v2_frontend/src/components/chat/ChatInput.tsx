import { Paperclip, ArrowUp } from 'lucide-react';
import { Button } from '../common/Button';
import { useRef, useState } from 'react';
import { cn } from '../../utils/cn';

interface ChatInputProps {
  onSendMessage: (message: string, attachments?: File[]) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const ChatInput = ({ onSendMessage, disabled, placeholder = "Describe your footwear idea..." }: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto resize
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  const handleSend = () => {
    if (!message.trim()) return;
    onSendMessage(message);
    setMessage('');
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 bg-white border-t border-gray-100 relative">
      <div className="max-w-5xl mx-auto relative flex items-end gap-2 p-2 bg-white border border-gray-300 rounded-xl shadow-sm focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500 transition-all">
        {/* Attachment Button */}
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600 rounded-lg flex-shrink-0 mb-1">
          <Paperclip size={20} />
        </Button>

        {/* Text Input */}
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          disabled={disabled}
          className="flex-1 max-h-[120px] py-3 text-base text-gray-700 placeholder-gray-400 bg-transparent border-none focus:ring-0 resize-none overflow-y-auto"
        />

        {/* Send Button */}
        <Button 
          variant="primary" 
          size="icon" 
          className={cn("rounded-lg flex-shrink-0 mb-1 transition-all", !message.trim() ? "bg-gray-200 text-gray-400 hover:bg-gray-300 shadow-none" : "")}
          onClick={handleSend}
          disabled={!message.trim() || disabled}
        >
          <ArrowUp size={20} />
        </Button>
      </div>
      
      <div className="text-center mt-2 text-xs text-gray-400">
        Mercury AI can make mistakes. Check generated designs carefully.
      </div>
    </div>
  );
};
