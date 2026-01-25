import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import type { ChatMessage } from '@/types/api/chat';
import { User, Wand2 } from 'lucide-react';

interface MessageItemProps {
  message: ChatMessage;
}

export const MessageItem = ({ message }: MessageItemProps) => {
  const isUser = message.role === 'user';
  
  // Format timestamp
  const timestamp = new Date(message.created_at).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex w-full mb-6 gap-3",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {/* Avatar (AI Only) */}
      {!isUser && (
        <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0 mt-1">
          <Wand2 size={16} className="text-primary-600" />
        </div>
      )}

      <div className={cn("flex flex-col max-w-[80%] md:max-w-[70%]", isUser ? "items-end" : "items-start")}>
        
        {/* Name & Time */}
        <div className="flex items-center gap-2 mb-1 px-1">
          <span className="text-xs font-medium text-gray-600">
            {isUser ? 'You' : 'Mercury AI'}
          </span>
          <span className="text-[10px] text-gray-400">
            {timestamp}
          </span>
        </div>

        {/* Message Bubble */}
        <div
          className={cn(
            "px-5 py-3.5 text-[15px] leading-relaxed max-w-full",
            isUser
              ? "bg-gray-900 text-white rounded-2xl rounded-tr-sm" // Dark user bubble
              : "bg-gray-100 text-gray-800 rounded-2xl rounded-tl-sm" // Clean AI bubble (light gray, no border/shadow)
          )}
        >
          <div className="whitespace-pre-wrap leading-relaxed">
            {message.content}
          </div>
        </div>

        {/* TODO: Generated Images Grid - message_metadata에서 이미지 처리 */}

      </div>

      {/* Avatar (User Only) */}
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mt-1">
          <User size={16} className="text-gray-500" />
        </div>
      )}
    </motion.div>
  );
}; 
