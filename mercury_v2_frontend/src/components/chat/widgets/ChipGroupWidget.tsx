import type { WidgetOption } from '@/types/richChat';

interface ChipGroupWidgetProps {
  options: WidgetOption[];
  onSelect: (optionId: string) => void;
  selectedId?: string;
  disabled?: boolean;
}

export const ChipGroupWidget = ({ options, onSelect, selectedId, disabled }: ChipGroupWidgetProps) => {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {options.map((option) => {
        const isSelected = selectedId === option.id;
        
        return (
          <button
            key={option.id}
            onClick={() => !disabled && onSelect(option.id)}
            disabled={disabled}
            className={`
              px-4 py-2 rounded-full text-sm font-medium transition-all border
              ${isSelected
                ? 'bg-primary-600 text-white border-primary-600 shadow-md transform scale-105'
                : 'bg-white text-gray-700 border-gray-200 hover:border-primary-400 hover:bg-gray-50'
              }
              ${disabled && !isSelected ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};
