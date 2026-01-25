import { useState, useCallback, useRef } from 'react';

export type ToolType = 'select' | 'hand' | 'brush' | 'eraser' | 'shape' | 'text' | 'image';

interface CanvasState {
  scale: number;
  offset: { x: number; y: number };
}

export const useCanvas = () => {
  const [activeTool, setActiveTool] = useState<ToolType>('select');
  const [canvasState, setCanvasState] = useState<CanvasState>({
    scale: 1,
    offset: { x: 0, y: 0 },
  });
  
  // Use refs to access latest state in event handlers without triggering re-attachments
  const canvasStateRef = useRef(canvasState);
  const activeToolRef = useRef(activeTool);

  // Sync refs with state
  canvasStateRef.current = canvasState;
  activeToolRef.current = activeTool;

  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(isDragging);
  isDraggingRef.current = isDragging;

  // Zoom Logic - Stable reference
  const handleWheel = useCallback((e: WheelEvent) => {
    // Crucial: Prevent default browser zoom
    if (e.ctrlKey || e.metaKey) {
       e.preventDefault();
    }
  
    const currentState = canvasStateRef.current;

    // Ctrl + Wheel to Zoom
    if (e.ctrlKey || e.metaKey) {
      const zoomSensitivity = 0.001;
      const delta = -e.deltaY * zoomSensitivity;
      const newScale = Math.min(Math.max(0.1, currentState.scale + delta), 5); // Limit zoom 0.1x to 5x
      
      setCanvasState((prev) => ({
        ...prev,
        scale: newScale,
      }));
    } else {
      // Regular Wheel to Pan
      setCanvasState((prev) => ({
        ...prev,
        offset: {
          x: prev.offset.x - e.deltaX,
          y: prev.offset.y - e.deltaY,
        },
      }));
    }
  }, []);

  // Pan Logic (Middle Click or Space + Drag)
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Middle mouse button (1) or Spacebar held implies panning
    if (e.button === 1 || activeToolRef.current === 'select') { 
      setIsDragging(true);
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDraggingRef.current) {
      setCanvasState((prev) => ({
        ...prev,
        offset: {
          x: prev.offset.x + e.movementX,
          y: prev.offset.y + e.movementY,
        },
      }));
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  return {
    activeTool,
    setActiveTool,
    canvasState,
    setCanvasState,
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    isDragging
  };
};
