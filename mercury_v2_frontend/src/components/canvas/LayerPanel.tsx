import { motion } from 'framer-motion';
import { Layers, Eye, EyeOff, Lock, Unlock, Trash2, Plus } from 'lucide-react';
import { Button } from '../common/Button';
import { mockLayers } from '@/mocks/data/canvas';
import { cn } from '../../utils/cn';

export const LayerPanel = () => {
  return (
    <motion.div
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="absolute top-6 right-6 w-[260px] bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 flex flex-col z-40 overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
         <h3 className="font-heading font-semibold text-gray-800 flex items-center gap-2">
           <Layers size={18} /> Layers
         </h3>
         <Button variant="ghost" size="icon" className="h-6 w-6">
           <Plus size={16} />
         </Button>
      </div>

      {/* Layer List */}
      <div className="flex-1 max-h-[400px] overflow-y-auto p-2 space-y-1">
        {mockLayers.map((layer) => (
          <div 
            key={layer.id}
            className={cn(
              "flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors group",
              "hover:bg-gray-100",
              layer.id === 'l1' ? "bg-primary-50 border border-primary-100" : "bg-transparent border border-transparent"
            )}
          >
            {/* Thumbnail */}
            <div className="w-8 h-8 bg-gray-200 rounded overflow-hidden flex-shrink-0 flex items-center justify-center">
              {layer.type === 'image' && layer.thumbnailUrl && <img src={layer.thumbnailUrl} className="w-full h-full object-cover" />}
              {layer.type === 'shape' && <div className="w-4 h-4 rounded-full" style={{ backgroundColor: layer.color }} />}
              {layer.type === 'text' && <span className="text-xs font-bold text-gray-500">T</span>}
            </div>

            {/* Name */}
            <span className="flex-1 text-sm text-gray-700 truncate select-none">
              {layer.name}
            </span>

            {/* Actions (Hover) */}
            <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="text-gray-400 hover:text-gray-600 p-0.5">
                {layer.locked ? <Lock size={12} /> : <Unlock size={12} />}
              </button>
              <button className="text-gray-400 hover:text-gray-600 p-0.5">
                {layer.visible ? <Eye size={14} /> : <EyeOff size={14} />}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-100 bg-gray-50 flex justify-end">
        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600">
           <Trash2 size={16} />
        </Button>
      </div>
    </motion.div>
  );
};
