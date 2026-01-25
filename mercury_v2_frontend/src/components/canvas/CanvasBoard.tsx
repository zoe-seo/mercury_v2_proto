import { useRef, useEffect } from 'react';
import { useCanvas } from '../../hooks/useCanvas';
import { mockCanvasProject } from '../../mocks/data/canvas';

interface CanvasBoardProps {
  logic: ReturnType<typeof useCanvas>;
}

export const CanvasBoard = ({ logic }: CanvasBoardProps) => {
  const { canvasState, handleWheel, handleMouseDown, handleMouseMove, handleMouseUp, isDragging } = logic;
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    element.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      element.removeEventListener('wheel', handleWheel);
    };
  }, [handleWheel]);

  const gridStyle = {
    backgroundSize: `${20 * canvasState.scale}px ${20 * canvasState.scale}px`,
    backgroundPosition: `${canvasState.offset.x}px ${canvasState.offset.y}px`,
    backgroundImage: `radial-gradient(circle, #ddd 1px, transparent 1px)`,
  };
  
  const contentStyle = {
    transform: `translate(${canvasState.offset.x}px, ${canvasState.offset.y}px) scale(${canvasState.scale})`,
    transformOrigin: '0 0',
  };

  return (
    <div 
      ref={containerRef}
      className={`absolute inset-0 z-0 overflow-hidden cursor-grab ${isDragging ? 'cursor-grabbing' : ''} bg-gray-50`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={gridStyle}
    >
      <div 
        className="absolute top-0 left-0 w-full h-full pointer-events-none" 
        style={contentStyle}
      >
        {mockCanvasProject.layers?.map((layer) => {
          if (!layer.is_visible) return null;
          // Mock positioning based on layer_data or random defaults for visual/mock purpose
          const x = layer.layer_data.x || 100 + layer.z_index * 20;
          const y = layer.layer_data.y || 100 + layer.z_index * 20;
          const w = layer.layer_data.width || 200;
          const h = layer.layer_data.height || 150;
          const color = layer.layer_data.fill || '#e2e8f0';

          return (
            <div
              key={layer.id}
              className="absolute pointer-events-auto border border-transparent hover:border-primary-400 transition-colors"
              style={{
                left: x,
                top: y,
                width: w,
                height: h,
                opacity: layer.opacity ?? 1,
                zIndex: layer.z_index,
              }}
            >
              {layer.layer_type === 'image' && (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                    Image Placeholder
                </div>
              )}
              
              {layer.layer_type === 'shape' && (
                <div 
                  className="w-full h-full shadow-sm"
                  style={{ backgroundColor: color }}
                />
              )}

              {layer.layer_type === 'sketch' && (
                  <svg className="w-full h-full overflow-visible pointer-events-none">
                      <path d="M 10 10 Q 50 100 100 50 T 190 100" stroke="black" strokeWidth="2" fill="none" />
                  </svg>
              )}

              {layer.layer_type === 'generated' && (
                <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 border border-indigo-200 flex items-center justify-center text-indigo-400 text-xs">
                    Generative Area
                </div>
              )}

              {/* Resize Handles Mock */}
              <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-white border border-primary-500" />
            </div>
          );
        })}
      </div>
      
      {/* HUD */}
      <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur px-2 py-1 rounded text-[10px] text-gray-500 pointer-events-none border border-gray-100 shadow-sm">
        {Math.round(canvasState.scale * 100)}% | {Math.round(canvasState.offset.x)}, {Math.round(canvasState.offset.y)}
      </div>
    </div>
  );
};
