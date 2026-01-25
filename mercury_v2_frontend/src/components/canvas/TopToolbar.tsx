import { motion } from 'framer-motion';
import { 
  MousePointer2, 
  Hand, 
  Type, 
  Image as ImageIcon, 
  Undo, 
  Redo,
  Loader2,
  AlertCircle,
  Pencil,
  Check,
  Edit3
} from 'lucide-react';
import { Button } from '../common/Button';
import { Tooltip } from '../common/Tooltip';
import type { ToolType } from '../../hooks/useFabricCanvas';
import { useState, useRef, useEffect } from 'react';
import { cn } from '../../utils/cn';

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
  
  // New Props
  canvasName?: string;
  onRename?: (name: string) => void;
  nodeCount?: number;
  onAddSketchNode?: () => void;
  onAddTextNode?: () => void;
  onUploadImage?: () => void;
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
  savingState = 'saved',
  canvasName = 'Untitled Canvas',
  onRename,
  nodeCount = 0,
  onAddSketchNode,
  onAddTextNode,
  onUploadImage,
}: TopToolbarProps) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(canvasName);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setNameInput(canvasName);
  }, [canvasName]);

  useEffect(() => {
    if (isEditingName && nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.select();
    }
  }, [isEditingName]);

  const handleNameSubmit = () => {
    if (nameInput.trim()) {
      onRename?.(nameInput.trim());
    } else {
      setNameInput(canvasName); // Revert if empty
    }
    setIsEditingName(false);
  };

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleNameSubmit();
    if (e.key === 'Escape') {
      setNameInput(canvasName);
      setIsEditingName(false);
    }
  };

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="absolute top-6 left-1/2 -translate-x-1/2 bg-white rounded-full shadow-lg border border-gray-100 py-2 px-4 flex items-center gap-4 z-50 pointer-events-auto"
    >
      {/* Canvas Name Editor */}
      <div className="flex items-center">
        {isEditingName ? (
          <input
            ref={nameInputRef}
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            onBlur={handleNameSubmit}
            onKeyDown={handleNameKeyDown}
            className="w-40 text-sm font-medium border border-primary-500 rounded px-2 py-1 outline-none"
          />
        ) : (
          <button
            onClick={() => setIsEditingName(true)}
            className="group flex items-center gap-1.5 px-2 py-1 rounded hover:bg-gray-50 text-sm font-medium text-gray-700 max-w-[200px]"
            title="Rename Canvas"
          >
            <span className="truncate">{canvasName}</span>
            <Edit3 size={12} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        )}
      </div>

      <div className="w-px h-6 bg-gray-200" />

      {/* Node Creation Group */}
      <div className="flex items-center gap-1">
        <Tooltip content="Add Sketch Node" shortcut="R">
          <Button
            variant="ghost"
            size="icon"
            onClick={onAddSketchNode}
            className="w-9 h-9 rounded-full text-gray-600 hover:text-primary-600 hover:bg-primary-50"
          >
            <div className="relative">
               <Pencil size={18} />
               <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-white border border-current rounded-[2px]" />
            </div>
          </Button>
        </Tooltip>
        
        <Tooltip content="Upload Image" shortcut="I">
          <Button
            variant="ghost"
            size="icon"
            onClick={onUploadImage}
            className="w-9 h-9 rounded-full text-gray-600 hover:text-primary-600 hover:bg-primary-50"
          >
            <ImageIcon size={18} />
          </Button>
        </Tooltip>
        
        <Tooltip content="Add Text" shortcut="T">
          <Button
            variant="ghost"
            size="icon"
            onClick={onAddTextNode}
            className="w-9 h-9 rounded-full text-gray-600 hover:text-primary-600 hover:bg-primary-50"
          >
            <Type size={18} />
          </Button>
        </Tooltip>
      </div>

      <div className="w-px h-6 bg-gray-200" />

      {/* Tools Group */}
      <div className="flex items-center gap-1">
        <Tooltip content="Select" shortcut="V">
          <Button
            variant={activeTool === 'select' ? 'primary' : 'ghost'}
            size="icon"
            onClick={() => setActiveTool('select')}
            className={`w-9 h-9 rounded-full ${activeTool === 'select' ? 'bg-indigo-100 text-indigo-700 ring-2 ring-indigo-200' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <MousePointer2 size={18} />
          </Button>
        </Tooltip>
        
        <Tooltip content="Hand Tool" shortcut="H">
          <Button
            variant={activeTool === 'hand' ? 'primary' : 'ghost'}
            size="icon"
            onClick={() => setActiveTool('hand')}
            className={`w-9 h-9 rounded-full ${activeTool === 'hand' ? 'bg-indigo-100 text-indigo-700 ring-2 ring-indigo-200' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <Hand size={18} />
          </Button>
        </Tooltip>
      </div>

      <div className="w-px h-6 bg-gray-200" />

      {/* Action Group */}
      <div className="flex items-center gap-1">
        <Tooltip content="Undo" shortcut="Ctrl+Z">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onUndo}
            disabled={!canUndo}
            className="rounded-full w-9 h-9 text-gray-500 disabled:opacity-30"
          >
            <Undo size={16} />
          </Button>
        </Tooltip>
        
        <Tooltip content="Redo" shortcut="Ctrl+Shift+Z">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onRedo}
            disabled={!canRedo}
            className="rounded-full w-9 h-9 text-gray-500 disabled:opacity-30"
          >
            <Redo size={16} />
          </Button>
        </Tooltip>
        
        {/* Zoom Indicator */}
        <Tooltip content="Reset Zoom">
          <button 
            onClick={() => setScale?.(1)}
            className="w-14 text-center text-xs font-medium text-gray-600 select-none hover:bg-gray-50 rounded px-1 py-1 transition-colors"
          >
            {Math.round(scale * 100)}%
          </button>
        </Tooltip>
      </div>

      <div className="w-px h-6 bg-gray-200" />

      {/* Node Count & Save Status */}
      <div className="flex items-center gap-3 pl-1">
        <div className={cn("text-xs font-medium", nodeCount >= 20 ? "text-red-500" : "text-gray-500")}>
          {nodeCount}/20
        </div>
        
        <div className="flex items-center gap-1 text-gray-400 select-none" title={savingState === 'saving' ? 'Saving...' : savingState === 'saved' ? 'All changes saved' : 'Error saving'}>
           {savingState === 'saving' ? (
             <Loader2 size={16} className="animate-spin text-primary-500" />
           ) : savingState === 'error' ? (
              <AlertCircle size={16} className="text-red-500" />
           ) : (
             <Check size={16} className="text-gray-400" />
           )}
        </div>
      </div>
    </motion.div>
  );
};
