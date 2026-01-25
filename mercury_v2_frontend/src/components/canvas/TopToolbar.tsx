import { motion } from 'framer-motion';
import { 
  MousePointer2, 
  Hand, 
  Brush, 
  Eraser, 
  Square, 
  Type, 
  Image as ImageIcon, 
  Undo, 
  Redo, 
  Share, 
  Cloud as CloudCheck,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Button } from '../common/Button';
import type { ToolType } from '../../hooks/useCanvas';

interface TopToolbarProps {
  activeTool: ToolType;
  setActiveTool: (tool: ToolType) => void;
  scale?: number;
  setScale?: (scale: number) => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
  onExport?: () => void;
  savingState?: 'saved' | 'saving' | 'error';
}

export const TopToolbar = ({ 
  activeTool, 
  setActiveTool, 
  scale = 1, 
  setScale,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
  onExport,
  savingState = 'saved'
}: TopToolbarProps) => {
  const tools = [
    { id: 'select', icon: MousePointer2, label: 'Select (V)' },
    { id: 'hand', icon: Hand, label: 'Hand (H)' },
    { id: 'brush', icon: Brush, label: 'Brush (B)' },
    { id: 'eraser', icon: Eraser, label: 'Eraser (E)' },
    { id: 'shape', icon: Square, label: 'Shape (R)' },
    { id: 'text', icon: Type, label: 'Text (T)' },
    { id: 'image', icon: ImageIcon, label: 'Image (I)' },
  ] as const;

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="absolute top-6 left-1/2 -translate-x-1/2 bg-white rounded-full shadow-lg border border-gray-100 py-2 px-6 flex items-center gap-2 z-50 pointer-events-auto"
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
            className={`w-10 h-10 rounded-full ${activeTool === tool.id ? 'bg-primary-50 text-primary-600' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <tool.icon size={20} />
          </Button>
        ))}
      </div>

      {/* Divider */}
      <div className="w-px h-6 bg-gray-200 mx-2" />

      {/* Action Group */}
      <div className="flex items-center gap-1">
        <Button 
          variant="ghost" 
          size="icon" 
          title="Undo (Cmd+Z)" 
          onClick={onUndo}
          disabled={!canUndo}
          className="rounded-full w-10 h-10 text-gray-500 disabled:opacity-30"
        >
          <Undo size={18} />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          title="Redo (Cmd+Shift+Z)" 
          onClick={onRedo}
          disabled={!canRedo}
          className="rounded-full w-10 h-10 text-gray-500 disabled:opacity-30"
        >
          <Redo size={18} />
        </Button>
        
        {/* Zoom Indicator */}
        <button 
          onClick={() => setScale?.(1)}
          className="w-16 text-center text-sm font-medium text-gray-600 select-none hover:bg-gray-50 rounded px-2 py-1 transition-colors"
          title="Reset Zoom"
        >
          {Math.round(scale * 100)}%
        </button>

        {/* Saved Status */}
        <div className="flex items-center gap-1.5 px-3 text-gray-400 select-none" title={savingState === 'saving' ? 'Saving...' : savingState === 'saved' ? 'All changes saved' : 'Error saving'}>
           {savingState === 'saving' ? (
             <Loader2 size={16} className="animate-spin text-primary-500" />
           ) : savingState === 'error' ? (
              <AlertCircle size={16} className="text-red-500" />
           ) : (
             <CloudCheck size={16} />
           )}
        </div>

        <Button 
          variant="ghost" 
          size="icon" 
          title="Export"
          onClick={onExport}
          className="rounded-full w-10 h-10 text-gray-500 hover:text-gray-900"
        >
          <Share size={18} />
        </Button>
      </div>
    </motion.div>
  );
};
