import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import type { Message } from '@/mocks/data/home';
import { User, Wand2, Download, Palette } from 'lucide-react';
import { Button } from '../common/Button';

interface MessageItemProps {
  message: Message;
}

export const MessageItem = ({ message }: MessageItemProps) => {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  if (isSystem) {
    return (
      <div className="flex justify-center my-4">
        <span className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full">
          {message.content} · {message.timestamp}
        </span>
      </div>
    );
  }

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
            {message.timestamp}
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

        {/* Generated Images Grid */}
        {message.images && message.images.length > 0 && (
          <div className="mt-3 grid grid-cols-2 gap-2 w-full max-w-[500px]">
            {message.images.map((img, idx) => (
              <div key={idx} className="group relative aspect-square bg-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer">
                <img src={img} alt={`Generated ${idx}`} className="w-full h-full object-cover" />
                
                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                   <Button variant="secondary" size="icon" className="h-8 w-8 bg-white/90 border-none hover:bg-white text-gray-700">
                     <Download size={14} />
                   </Button>
                   <Button variant="secondary" size="icon" className="h-8 w-8 bg-white/90 border-none hover:bg-white text-gray-700">
                     <Palette size={14} /> {/* Edit in Canvas */}
                   </Button>
                </div>
              </div>
            ))}
          </div>
        )}

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
