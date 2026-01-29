import type { Message, Widget } from '@/types/richChat';
import { SelectionCardWidget } from './widgets/SelectionCardWidget';
import { ChipGroupWidget } from './widgets/ChipGroupWidget';
import { GenerationResultWidget } from './widgets/GenerationResultWidget';
import { Bot, User } from 'lucide-react';

interface RichMessageBubbleProps {
  message: Message;
  isLatest: boolean;
  onWidgetSelect: (messageId: string, value: any) => void;
}

export const RichMessageBubble = ({ message, onWidgetSelect }: RichMessageBubbleProps) => {
  const isUser = message.role === 'user';
  
  // Widget Handler
  const handleSelect = (value: any) => {
    onWidgetSelect(message.id, value);
  };

  // Render Widget based on type
  const renderWidget = (widget: Widget) => {
    // If it's not the latest message, we might want to show it as "selected state" or "disabled"
    // For now, let's keep it enabled but visual indication could be added

    switch (widget.type) {
      case 'selection_card':
        return (
          <SelectionCardWidget
            options={widget.data.options || []}
            onSelect={handleSelect}
            // In a real app, we'd find which one is selected from the state or message metadata
            // For MVP, we presume the widget might carry its own selection state or we just show them
            selectedId={widget.data.options?.find(o => o.is_selected)?.id}
          />
        );
      case 'chip_group':
        return (
          <ChipGroupWidget
            options={widget.data.options || []}
            onSelect={handleSelect}
            selectedId={widget.data.options?.find(o => o.is_selected)?.id}
          />
        );
      case 'generation_result':
        return (
          <GenerationResultWidget
            taskId={widget.data.task_id}
            imageUrl={widget.data.main_image_url}
            status={widget.data.status}
          />
        );
      default:
        return null; // Unknown widget type
    }
  };

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      
      {/* Avatar (Left for AI) */}
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
          <Bot size={18} className="text-indigo-600" />
        </div>
      )}

      <div className={`flex flex-col max-w-[85%] ${isUser ? 'items-end' : 'items-start'}`}>
        
        {/* Text Bubble */}
        <div className={`
          px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm
          ${isUser 
            ? 'bg-indigo-600 text-white rounded-tr-sm' 
            : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm'
          }
        `}>
          {message.content}
        </div>

        {/* Attached Widget (Only for Assistant) */}
        {!isUser && message.widget && (
          <div className="mt-2 pl-1 animate-in fade-in slide-in-from-top-2 duration-300">
            {renderWidget(message.widget)}
          </div>
        )}
      </div>

      {/* Avatar (Right for User) */}
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center ml-3 mt-1 flex-shrink-0">
          <User size={18} className="text-primary-600" />
        </div>
      )}
    </div>
  );
};
