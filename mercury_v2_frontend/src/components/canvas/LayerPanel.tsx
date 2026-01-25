import { motion } from 'framer-motion';
import {
  Layers,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Trash2,
  Plus,
  GripVertical,
  Image as ImageIcon,
  PenTool,
  Type,
  Box,
} from 'lucide-react';
import { Button } from '../common/Button';
import { cn } from '../../utils/cn';
import { useCanvasStore } from '../../store/canvasStore';
import { useUpdateLayer, useDeleteLayer } from '../../queries/useCanvas';

interface LayerPanelProps {
  canvasId: string | undefined;
}

export const LayerPanel = ({ canvasId }: LayerPanelProps) => {
  const { layers, setLayers, selectedObjectId, setSelectedObjectId } =
    useCanvasStore();
  const { mutate: updateLayer } = useUpdateLayer();
  const { mutate: deleteLayer } = useDeleteLayer();

  const toggleVisibility = (layerId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    const layer = layers.find((l) => l.id === layerId);
    if (!layer || !canvasId) return;

    const newVisibility = !layer.is_visible;

    // Optimistic update
    setLayers(
      layers.map((l) =>
        l.id === layerId ? { ...l, is_visible: newVisibility } : l
      )
    );

    // API call
    updateLayer({
      canvasId,
      layerId,
      data: { is_visible: newVisibility },
    });
  };

  const toggleLock = (layerId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    const layer = layers.find((l) => l.id === layerId);
    if (!layer || !canvasId) return;

    const newLockState = !layer.is_locked;

    // Optimistic update
    setLayers(
      layers.map((l) =>
        l.id === layerId ? { ...l, is_locked: newLockState } : l
      )
    );

    // API call
    updateLayer({
      canvasId,
      layerId,
      data: { is_locked: newLockState },
    });
  };

  const handleDeleteLayer = () => {
    if (!selectedObjectId || !canvasId) return;

    // Optimistic update
    setLayers(layers.filter((l) => l.id !== selectedObjectId));
    setSelectedObjectId(null);

    // API call
    deleteLayer({ canvasId, layerId: selectedObjectId });
  };

  const getLayerIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon size={14} />;
      case 'text':
        return <Type size={14} />;
      case 'sketch':
        return <PenTool size={14} />;
      case 'generated':
        return <Box size={14} />;
      default:
        return <Box size={14} />;
    }
  };

  return (
    <motion.div
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="absolute top-24 right-6 w-64 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 flex flex-col z-40 overflow-hidden pointer-events-auto"
    >
      {/* Header */}
      <div className="p-3 border-b border-gray-100 flex items-center justify-between bg-white">
        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Layers size={16} /> Layers
        </h3>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <Plus size={14} />
        </Button>
      </div>

      {/* Layer List */}
      <div className="flex-1 max-h-[300px] overflow-y-auto p-2 space-y-1">
        {[...layers].reverse().map((layer) => (
          <div
            key={layer.id}
            onClick={() => setSelectedObjectId(layer.id)}
            className={cn(
              'flex items-center gap-2 p-1.5 rounded-lg cursor-pointer transition-colors group text-sm select-none',
              layer.id === selectedObjectId
                ? 'bg-primary-50 border border-primary-200'
                : 'bg-transparent border border-transparent hover:bg-gray-50'
            )}
          >
            {/* Drag Handle */}
            <div className="text-gray-300 cursor-grab opacity-0 group-hover:opacity-100">
              <GripVertical size={12} />
            </div>

            {/* Icon / Thumbnail */}
            <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center text-gray-500">
              {getLayerIcon(layer.layer_type)}
            </div>

            {/* Name */}
            <span
              className={cn(
                'flex-1 truncate',
                layer.id === selectedObjectId
                  ? 'text-primary-700 font-medium'
                  : 'text-gray-600'
              )}
            >
              {layer.name || `Layer ${layer.z_index}`}
            </span>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => toggleLock(layer.id, e)}
                className={cn(
                  'p-1 rounded hover:bg-gray-200 transition-colors',
                  layer.is_locked
                    ? 'text-amber-500'
                    : 'text-gray-300 opacity-0 group-hover:opacity-100'
                )}
              >
                {layer.is_locked ? <Lock size={12} /> : <Unlock size={12} />}
              </button>
              <button
                onClick={(e) => toggleVisibility(layer.id, e)}
                className={cn(
                  'p-1 rounded hover:bg-gray-200 transition-colors',
                  !layer.is_visible
                    ? 'text-gray-400'
                    : 'text-gray-400 opacity-0 group-hover:opacity-100'
                )}
              >
                {layer.is_visible ? <Eye size={12} /> : <EyeOff size={12} />}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
        <div className="text-[10px] text-gray-400 px-2">Drag to reorder</div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-gray-500 hover:text-red-500 hover:bg-red-50"
          disabled={!selectedObjectId}
          onClick={handleDeleteLayer}
        >
          <Trash2 size={14} />
        </Button>
      </div>
    </motion.div>
  );
};
