import type { WidgetOption } from '@/types/richChat';
import { Check } from 'lucide-react';

interface SelectionCardWidgetProps {
  options: WidgetOption[];
  onSelect: (optionId: string) => void;
  selectedId?: string;
  disabled?: boolean;
}

export const SelectionCardWidget = ({ options, onSelect, selectedId, disabled }: SelectionCardWidgetProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3 w-full max-w-lg">
      {options.map((option) => {
        const isSelected = selectedId === option.id;
        
        return (
          <button
            key={option.id}
            onClick={() => !disabled && onSelect(option.id)}
            disabled={disabled}
            className={`
              relative group flex flex-col items-center p-3 rounded-xl border transition-all text-left
              ${isSelected 
                ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500' 
                : 'border-gray-200 bg-white hover:border-primary-300 hover:shadow-sm'
              }
              ${disabled && !isSelected ? 'opacity-50 grayscale cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            {/* Image Area */}
            <div className="w-full aspect-square rounded-lg bg-gray-50 mb-3 flex items-center justify-center overflow-hidden">
               {option.image_url ? (
                 <img src={option.image_url} alt={option.label} className="w-full h-full object-contain p-2" />
               ) : (
                 <div className="text-gray-300 text-xs">No Image</div>
               )}
            </div>
            
            {/* Label */}
            <span className={`text-sm font-medium ${isSelected ? 'text-primary-700' : 'text-gray-700'}`}>
              {option.label}
            </span>

            {/* Selection Check Badge */}
            {isSelected && (
              <div className="absolute top-2 right-2 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center text-white shadow-sm">
                <Check size={12} strokeWidth={3} />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};
