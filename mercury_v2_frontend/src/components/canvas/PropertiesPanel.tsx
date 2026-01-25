import { motion } from 'framer-motion';
import { Sliders, Pipette, Hash } from 'lucide-react';
import type { ToolType } from '../../hooks/useFabricCanvas';
import { useCanvasStore } from '../../store/canvasStore';
import { useFabricCanvas } from '../../hooks/useFabricCanvas';
import { useState } from 'react';

interface PropertiesPanelProps {
  activeTool: ToolType;
  selectedObject?: any;
  canvasId: string | undefined;
}

export const PropertiesPanel = ({ activeTool, selectedObject, canvasId }: PropertiesPanelProps) => {
  const { brushSettings, setBrushSize, setBrushColor } = useCanvasStore();
  const { fabricCanvasRef } = useFabricCanvas(canvasId);
  const [localSize, setLocalSize] = useState(brushSettings.size);
  const [localColor, setLocalColor] = useState(brushSettings.color);

  // If no specific properties to show, hide panel
  if (['hand', 'eraser', 'image'].includes(activeTool) && !selectedObject) {
    return null;
  }
  
  // Also hide if in select mode but nothing selected
  if (activeTool === 'select' && !selectedObject) {
    return null;
  }

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(e.target.value);
    setLocalSize(newSize);
    setBrushSize(newSize);
    
    // Update Fabric brush immediately
    const canvas = fabricCanvasRef.current;
    if (canvas && canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.width = newSize;
    }
  };

  const handleColorChange = (color: string) => {
    setLocalColor(color);
    setBrushColor(color);
    
    // Update Fabric brush immediately
    const canvas = fabricCanvasRef.current;
    if (canvas && canvas.freeDrawingBrush && activeTool === 'brush') {
      canvas.freeDrawingBrush.color = color;
    }
  };

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="absolute top-24 left-6 w-64 bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-gray-100 p-4 z-40 pointer-events-auto flex flex-col gap-4"
    >
      <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 pb-2 border-b border-gray-100">
        <Sliders size={16} />
        <span>Properties</span>
      </div>

      {/* Brush Properties */}
      {activeTool === 'brush' && (
        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Size</span>
              <span>{localSize}px</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="100" 
              value={localSize}
              onChange={handleSizeChange}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
            />
          </div>
          
          <div className="space-y-2">
             <div className="flex justify-between text-xs text-gray-500">
              <span>Color</span>
            </div>
            <div className="flex items-center gap-2">
               <div 
                 className="w-8 h-8 rounded-full border border-gray-200 cursor-pointer shadow-sm"
                 style={{ backgroundColor: localColor }}
               ></div>
               <div className="flex-1 h-8 rounded-md border border-gray-200 flex items-center px-2 gap-2 text-xs text-gray-600 bg-white">
                  <Hash size={12} />
                  <input
                    type="text"
                    value={localColor.replace('#', '')}
                    onChange={(e) => handleColorChange('#' + e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none"
                    maxLength={6}
                  />
               </div>
               <button className="p-1.5 rounded-md hover:bg-gray-100" title="Eyedropper">
                  <Pipette size={16} className="text-gray-600"/>
               </button>
            </div>
             <div className="flex gap-1.5 flex-wrap">
                {['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF'].map(c => (
                    <div 
                      key={c} 
                      className="w-5 h-5 rounded-full border border-gray-200 cursor-pointer hover:ring-2 hover:ring-primary-400" 
                      style={{ backgroundColor: c}}
                      onClick={() => handleColorChange(c)}
                    />
                ))}
             </div>
          </div>
        </div>
      )}

      {/* Selection Properties (Mock) */}
      {(activeTool === 'select' && selectedObject) && (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-500">X</label>
                    <input className="w-full px-2 py-1 text-sm border border-gray-200 rounded" value="100" readOnly />
                </div>
                 <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-500">Y</label>
                    <input className="w-full px-2 py-1 text-sm border border-gray-200 rounded" value="50" readOnly />
                </div>
                 <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-500">W</label>
                    <input className="w-full px-2 py-1 text-sm border border-gray-200 rounded" value="200" readOnly />
                </div>
                 <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-500">H</label>
                    <input className="w-full px-2 py-1 text-sm border border-gray-200 rounded" value="150" readOnly />
                </div>
            </div>
        </div>
      )}
      
      {/* Default placeholder for other tools */}
      {['shape', 'text'].includes(activeTool) && (
          <div className="text-xs text-gray-400 text-center py-4">
              Select an option to configure
          </div>
      )}
    </motion.div>
  );
};
