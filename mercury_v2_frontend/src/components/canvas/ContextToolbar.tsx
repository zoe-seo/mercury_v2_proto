import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brush, Eraser, Check, X, Palette } from 'lucide-react';
import * as fabric from 'fabric';
import { useCanvasStore } from '../../store/canvasStore';
import { Button } from '../common/Button';
import { cn } from '../../utils/cn';

interface ContextToolbarProps {
  canvas: fabric.Canvas | null;
}

export const ContextToolbar = ({ canvas }: ContextToolbarProps) => {
  const { 
    selectedObjectId, 
    layers, 
    isEditMode, 
    setEditMode, 
    brushSettings, 
    setBrushColor, 
    setBrushSize 
  } = useCanvasStore();
  
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const [localTool, setLocalTool] = useState<'brush' | 'eraser' | null>(null);

  // Sync edit mode with local tool
  useEffect(() => {
    if (!isEditMode) {
      setLocalTool(null);
    }
  }, [isEditMode]);

  // Update position relative to selected object
  useEffect(() => {
    const updatePosition = () => {
      if (!canvas || !selectedObjectId) {
        setPosition(null);
        return;
      }

      const activeObject = canvas.getActiveObject();
      // Or find by ID if active object is missing (Edit mode locked case)
      const targetObject = activeObject || canvas.getObjects().find((obj: any) => obj.layerId === selectedObjectId);

      if (targetObject) {
        const bounds = targetObject.getBoundingRect();
        // Position centered above the object
        setPosition({
          top: bounds.top - 60, // 60px above
          left: bounds.left + bounds.width / 2
        });
      } else {
        setPosition(null);
      }
    };

    updatePosition();
    
    // Add listeners for object movement/scaling
    if (canvas) {
      canvas.on('object:moving', updatePosition);
      canvas.on('object:scaling', updatePosition);
      canvas.on('object:resizing', updatePosition);
      canvas.on('object:modified', updatePosition);
      canvas.on('selection:created', updatePosition);
      canvas.on('selection:updated', updatePosition);
      canvas.on('selection:cleared', updatePosition);
      // Custom event for viewport changes
      canvas.on('mouse:wheel', updatePosition); 
    }

    return () => {
      if (canvas) {
        canvas.off('object:moving', updatePosition);
        canvas.off('object:scaling', updatePosition);
        canvas.off('object:resizing', updatePosition);
        canvas.off('object:modified', updatePosition);
        canvas.off('selection:created', updatePosition);
        canvas.off('selection:updated', updatePosition);
        canvas.off('selection:cleared', updatePosition);
        canvas.off('mouse:wheel', updatePosition);
      }
    };
  }, [canvas, selectedObjectId, layers]); // Dependency on layers to re-check if selectedLayer type changes?

  const selectedLayer = layers.find(l => l.id === selectedObjectId);
  
  if (!selectedObjectId || !selectedLayer || !position) return null;

  const isSketch = selectedLayer.layer_type === 'sketch';
  const isImage = selectedLayer.layer_type === 'image';
  
  // Only show for Sketch Nodes (Image nodes now use ImageContextPanel)
  if (!isSketch) return null;

  const handleEnterEditMode = () => {
    setEditMode(true, selectedObjectId);
    setLocalTool('brush');
    // Actual logic for locking will be handled in useFabricCanvas via store subscription
  };

  const handleExitEditMode = () => {
    setEditMode(false, null);
    setLocalTool(null);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        style={{ 
          top: position.top, 
          left: position.left,
          position: 'absolute',
          transform: 'translate(-50%, 0)', // Center horizontally
          zIndex: 50 // Above canvas
        }}
        className="flex items-center gap-2 bg-white rounded-full shadow-lg border border-gray-200 p-1.5"
      >
        {!isEditMode ? (
          /* Normal Selection State */
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEnterEditMode}
              className="flex items-center gap-2 px-3 hover:bg-indigo-50 hover:text-indigo-600 rounded-full text-gray-700"
            >
              {isSketch ? <Brush size={16} /> : <Brush size={16} />}
              <span className="text-xs font-medium">{isSketch ? 'Edit Sketch' : 'Inpaint'}</span>
            </Button>
            
            <div className="w-px h-4 bg-gray-200 mx-1" />
            
            {/* Common Actions */}
            <Button size="icon" variant="ghost" className="w-8 h-8 rounded-full text-gray-500 hover:text-red-500 hover:bg-red-50">
               <X size={16} /> 
               {/* Delete or Close? Maybe delete logic belongs to LayerPanel, here is context edit */}
            </Button>
          </>
        ) : (
          /* Edit Mode State */
          <>
            <div className="flex items-center gap-1 bg-gray-50 rounded-full p-1 mr-2">
               <span className="text-[10px] font-bold text-indigo-500 px-2 uppercase tracking-wide">
                 Editing
               </span>
            </div>

            <Button
              variant={localTool === 'brush' ? 'primary' : 'ghost'}
              size="icon"
              onClick={() => setLocalTool('brush')}
              className={cn(
                "w-8 h-8 rounded-full",
                localTool === 'brush' ? "bg-indigo-100 text-indigo-600" : "text-gray-500 hover:bg-gray-50"
              )}
            >
              <Brush size={16} />
            </Button>
            
            <Button
              variant={localTool === 'eraser' ? 'primary' : 'ghost'}
              size="icon"
              onClick={() => setLocalTool('eraser')}
              className={cn(
                "w-8 h-8 rounded-full",
                localTool === 'eraser' ? "bg-indigo-100 text-indigo-600" : "text-gray-500 hover:bg-gray-50"
              )}
            >
              <Eraser size={16} />
            </Button>

            <div className="w-px h-4 bg-gray-200 mx-1" />
            
            {/* Color/Size Logic would go here */}
            <Button size="icon" variant="ghost" className="w-8 h-8 rounded-full text-gray-500">
               <Palette size={16} />
            </Button>

            <div className="w-px h-4 bg-gray-200 mx-1" />

            <Button
              variant="primary"
              size="sm"
              onClick={handleExitEditMode}
              className="flex items-center gap-1 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full"
            >
              <Check size={14} />
              <span className="text-xs font-medium">Done</span>
            </Button>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
