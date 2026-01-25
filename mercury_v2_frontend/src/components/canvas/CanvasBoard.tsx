import { useEffect, useRef } from 'react';
import { useFabricCanvas } from '../../hooks/useFabricCanvas';
import { useCanvasStore } from '../../store/canvasStore';

interface CanvasBoardProps {
  canvasId: string | undefined;
}

export const CanvasBoard = ({ canvasId }: CanvasBoardProps) => {
  const canvasElementRef = useRef<HTMLCanvasElement>(null);
  const { initCanvas, fabricCanvasRef, canvasState } = useFabricCanvas(canvasId);
  const { savingState } = useCanvasStore();

  // Initialize Fabric Canvas
  useEffect(() => {
    if (canvasElementRef.current && !fabricCanvasRef.current) {
      const cleanup = initCanvas(canvasElementRef.current);
      return cleanup;
    }
  }, [initCanvas, fabricCanvasRef]);

  // Resize canvas on window resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = fabricCanvasRef.current;
      if (canvas) {
        canvas.setWidth(window.innerWidth);
        canvas.setHeight(window.innerHeight);
        canvas.renderAll();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [fabricCanvasRef]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-gray-50">
      {/* Fabric Canvas */}
      <canvas ref={canvasElementRef} />

      {/* HUD - Zoom and Position Info */}
      <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur px-3 py-2 rounded-lg text-xs text-gray-500 pointer-events-none border border-gray-100 shadow-sm flex items-center gap-3">
        <span>Zoom: {Math.round(canvasState.scale * 100)}%</span>
        <div className="w-px h-4 bg-gray-300" />
        <span>
          {savingState === 'saving' && '💾 Saving...'}
          {savingState === 'saved' && '✓ Saved'}
          {savingState === 'error' && '⚠️ Error'}
        </span>
      </div>
    </div>
  );
};
