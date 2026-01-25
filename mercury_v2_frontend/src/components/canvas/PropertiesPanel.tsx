import { motion } from 'framer-motion';
import { Sliders, Pipette, Hash } from 'lucide-react';
import type { ToolType } from '../../hooks/useCanvas';

interface PropertiesPanelProps {
  activeTool: ToolType;
  selectedObject?: any; // To be typed properly with Fabric object types later
  onPropertyChange?: (property: string, value: any) => void;
}

export const PropertiesPanel = ({ activeTool, selectedObject }: PropertiesPanelProps) => {
  // If no specific properties to show, hide panel
  if (['hand', 'eraser', 'image'].includes(activeTool) && !selectedObject) {
    return null;
  }
  
  // Also hide if in select mode but nothing selected
  if (activeTool === 'select' && !selectedObject) {
    return null;
  }

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
              <span>12px</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="100" 
              defaultValue="12"
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
            />
          </div>
          
          <div className="space-y-2">
             <div className="flex justify-between text-xs text-gray-500">
              <span>Color</span>
            </div>
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 rounded-full bg-black border border-gray-200 cursor-pointer shadow-sm"></div>
               <div className="flex-1 h-8 rounded-md border border-gray-200 flex items-center px-2 gap-2 text-xs text-gray-600 bg-white">
                  <Hash size={12} />
                  <span>000000</span>
               </div>
               <button className="p-1.5 rounded-md hover:bg-gray-100" title="Eyedropper">
                  <Pipette size={16} className="text-gray-600"/>
               </button>
            </div>
             <div className="flex gap-1.5 flex-wrap">
                {['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF'].map(c => (
                    <div key={c} className="w-5 h-5 rounded-full border border-gray-200 cursor-pointer" style={{ backgroundColor: c}} />
                ))}
             </div>
          </div>

          <div className="space-y-2">
             <div className="flex justify-between text-xs text-gray-500">
              <span>Opacity</span>
              <span>100%</span>
            </div>
             <input 
              type="range" 
              min="0" 
              max="100" 
              defaultValue="100"
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
            />
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
            <div className="space-y-2">
             <div className="flex justify-between text-xs text-gray-500">
              <span>Opacity</span>
              <span>100%</span>
            </div>
             <input 
              type="range" 
              min="0" 
              max="100" 
              defaultValue="100"
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
            />
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
