import { useRef, useEffect } from 'react';
import { useCanvas } from '../../hooks/useCanvas';
import { mockLayers } from '../../api/mockCanvasData';

interface CanvasBoardProps {
  logic: ReturnType<typeof useCanvas>;
}

export const CanvasBoard = ({ logic }: CanvasBoardProps) => {
  const { canvasState, handleWheel, handleMouseDown, handleMouseMove, handleMouseUp, isDragging } = logic;
  const containerRef = useRef<HTMLDivElement>(null);

  // Attach non-passive wheel listener to block browser zoom
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    // React's onWheel is passive by default, so we must add a native listener with passive: false
    // to prevent the default browser zoom (Ctrl+Wheel).
    element.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      element.removeEventListener('wheel', handleWheel);
    };
  }, [handleWheel]);

  // Grid Background Style
  // We use CSS background-position to simulate moving grid without moving the actual div, 
  // or we can move the whole div. Moving grid pattern is often smoother for "infinite" feel.
  // Here we translate the background pattern based on offset.
  const gridStyle = {
    backgroundSize: `${20 * canvasState.scale}px ${20 * canvasState.scale}px`,
    backgroundPosition: `${canvasState.offset.x}px ${canvasState.offset.y}px`,
    backgroundImage: `radial-gradient(circle, #ddd 1px, transparent 1px)`,
  };
  
  // Transform for Content Layer
  const contentStyle = {
    transform: `translate(${canvasState.offset.x}px, ${canvasState.offset.y}px) scale(${canvasState.scale})`,
    transformOrigin: '0 0',
  };

  return (
    <div 
      ref={containerRef}
      className={`absolute inset-0 z-0 overflow-hidden cursor-grab ${isDragging ? 'cursor-grabbing' : ''}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={gridStyle}
    >
      {/* Content Layer */}
      <div 
        className="absolute top-0 left-0 w-full h-full pointer-events-none" // Content doesn't block scroll events, children need pointer-events-auto
        style={contentStyle}
      >
        {mockLayers.map((layer) => {
          if (!layer.visible) return null;
          return (
            <div
              key={layer.id}
              className="absolute pointer-events-auto" // Enable interaction on objects
              style={{
                left: layer.x,
                top: layer.y,
                width: layer.width,
                height: layer.height,
              }}
            >
              {/* Type Rendering */}
              {layer.type === 'image' && layer.content && (
                <img 
                   src={layer.content} 
                   alt={layer.name} 
                   className="w-full h-full object-cover shadow-lg select-none pointer-events-none" // prevent native drag
                />
              )}
              
              {layer.type === 'shape' && (
                <div 
                  className="w-full h-full rounded-lg shadow-md"
                  style={{ backgroundColor: layer.color }}
                />
              )}

              {layer.type === 'text' && (
                <div 
                  className="w-full h-full font-heading font-bold text-4xl whitespace-nowrap"
                  style={{ color: layer.color }}
                >
                  {layer.content}
                </div>
              )}

              {/* Selection Ring (Mock) */}
              <div className="absolute inset-0 border-2 border-transparent hover:border-primary-400 transition-colors" />
            </div>
          );
        })}
      </div>
      
      {/* Debug Info Overlay (Hidden in prod) */}
      <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs p-2 rounded pointer-events-none">
        Scale: {canvasState.scale.toFixed(2)} | X: {canvasState.offset.x.toFixed(0)} | Y: {canvasState.offset.y.toFixed(0)}
      </div>
    </div>
  );
};
