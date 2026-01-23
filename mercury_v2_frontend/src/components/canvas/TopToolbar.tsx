import { motion } from 'framer-motion';
import { MousePointer2, Brush, Square, Type, Eraser, Undo, Redo, Share, Cloud as CloudCheck } from 'lucide-react';
import { Button } from '../common/Button';
import type { ToolType } from '../../hooks/useCanvas';

interface TopToolbarProps {
  activeTool: ToolType;
  setActiveTool: (tool: ToolType) => void;
}

export const TopToolbar = ({ activeTool, setActiveTool }: TopToolbarProps) => {
  const tools = [
    { id: 'select', icon: MousePointer2, label: 'Select (V)' },
    { id: 'brush', icon: Brush, label: 'Brush (B)' },
    { id: 'shape', icon: Square, label: 'Shape (R)' },
    { id: 'text', icon: Type, label: 'Text (T)' },
    { id: 'eraser', icon: Eraser, label: 'Eraser (E)' },
  ] as const;

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="absolute top-6 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-lg border border-gray-200 p-2 flex items-center gap-2 z-50"
    >
      {/* Tool Group */}
      <div className="flex items-center gap-1">
        {tools.map((tool) => (
          <Button
            key={tool.id}
            variant={activeTool === tool.id ? 'primary' : 'ghost'}
            size="icon"
            onClick={() => setActiveTool(tool.id)}
            title={tool.label}
            className="w-10 h-10"
          >
            <tool.icon size={20} />
          </Button>
        ))}
      </div>

      {/* Divider */}
      <div className="w-px h-6 bg-gray-200 mx-2" />

      {/* Action Group */}
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" title="Undo (Cmd+Z)">
          <Undo size={18} />
        </Button>
        <Button variant="ghost" size="icon" title="Redo (Cmd+Shift+Z)">
          <Redo size={18} />
        </Button>
        
        {/* Zoom Indicator */}
        <div className="w-16 text-center text-sm font-medium text-gray-600 select-none">
          100%
        </div>

        {/* Saved Status */}
        <div className="flex items-center gap-1.5 px-3 text-gray-400 select-none">
           <CloudCheck size={16} />
           <span className="text-xs font-medium">Saved</span>
        </div>

        <Button variant="ghost" size="icon" title="Export">
          <Share size={18} />
        </Button>
      </div>
    </motion.div>
  );
};
