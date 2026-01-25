import { useState, useCallback, useRef, useEffect } from 'react';
import * as fabric from 'fabric';
import { useCanvasStore } from '../store/canvasStore';
import { useUpdateCanvasProject } from '../queries/useCanvas';

export type ToolType =
  | 'select'
  | 'hand'
  | 'brush'
  | 'eraser'
  | 'shape'
  | 'text'
  | 'image';

interface CanvasState {
  scale: number;
  offset: { x: number; y: number };
}

export const useFabricCanvas = (canvasId: string | undefined) => {
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const containerRef = useRef<HTMLCanvasElement | null>(null);

  const {
    activeTool,
    setActiveTool,
    selectedObjectId,
    setSelectedObjectId,
    pushHistory,
    setSavingState,
    brushSettings,
  } = useCanvasStore();

  const [canvasState, setCanvasState] = useState<CanvasState>({
    scale: 1,
    offset: { x: 0, y: 0 },
  });

  const [isDragging, setIsDragging] = useState(false);

  const { mutate: updateProject } = useUpdateCanvasProject();

  // Debounced auto-save
  const saveTimeoutRef = useRef<number | null>(null);
  const autoSave = useCallback(() => {
    if (!canvasId || canvasId === 'new' || !fabricCanvasRef.current) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    setSavingState('saving');

    saveTimeoutRef.current = setTimeout(() => {
      const canvas = fabricCanvasRef.current;
      if (!canvas) return;

      // Save canvas state
      const canvasJson = JSON.stringify(canvas.toJSON());
      pushHistory(canvasJson);

      // Get current viewport info
      const currentZoom = canvas.getZoom();

      // Update server
      updateProject(
        {
          canvasId,
          data: {
            canvas_state: {
              viewport: {
                x: 0,
                y: 0,
                zoom: currentZoom,
              },
            },
          },
        },
        {
          onSuccess: () => setSavingState('saved'),
          onError: () => setSavingState('error'),
        }
      );
    }, 2000);
  }, [canvasId, pushHistory, updateProject, setSavingState]);

  // Initialize Fabric Canvas
  const initCanvas = useCallback((element: HTMLCanvasElement) => {
    if (!element || fabricCanvasRef.current) return;

    const canvas = new fabric.Canvas(element, {
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: '#FAFAFA',
      selection: true,
      preserveObjectStacking: true,
    });

    fabricCanvasRef.current = canvas;
    containerRef.current = element;

    // Event listeners
    canvas.on('selection:created', (e) => {
      const obj = e.selected?.[0];
      if (obj) {
        setSelectedObjectId((obj as any).layerId || null);
      }
    });

    canvas.on('selection:updated', (e) => {
      const obj = e.selected?.[0];
      if (obj) {
        setSelectedObjectId((obj as any).layerId || null);
      }
    });

    canvas.on('selection:cleared', () => {
      setSelectedObjectId(null);
    });

    canvas.on('object:modified', () => {
      autoSave();
    });

    canvas.on('object:added', () => {
      autoSave();
    });

    canvas.on('object:removed', () => {
      autoSave();
    });

    return () => {
      canvas.dispose();
      fabricCanvasRef.current = null;
    };
  }, [setSelectedObjectId, autoSave]);

  // Tool Handlers
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    // Reset all modes
    canvas.isDrawingMode = false;
    canvas.selection = true;

    switch (activeTool) {
      case 'select':
        canvas.defaultCursor = 'default';
        canvas.hoverCursor = 'move';
        break;

      case 'hand':
        canvas.defaultCursor = 'grab';
        canvas.selection = false;
        break;

      case 'brush':
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
        canvas.freeDrawingBrush.width = brushSettings.size;
        canvas.freeDrawingBrush.color = brushSettings.color;
        break;

      case 'eraser':
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
        canvas.freeDrawingBrush.width = brushSettings.size;
        // Use destination-out composite operation for erasing
        (canvas.freeDrawingBrush as any).globalCompositeOperation = 'destination-out';
        break;

      case 'shape':
        canvas.defaultCursor = 'crosshair';
        canvas.selection = false;
        break;

      case 'text':
        canvas.defaultCursor = 'text';
        canvas.selection = false;
        break;

      case 'image':
        canvas.defaultCursor = 'default';
        break;

      default:
        break;
    }
  }, [activeTool, brushSettings]);

  // Add Shape
  const addShape = useCallback(
    (type: 'rect' | 'circle') => {
      const canvas = fabricCanvasRef.current;
      if (!canvas) return;

      let shape: fabric.Object;

      if (type === 'rect') {
        shape = new fabric.Rect({
          left: 100,
          top: 100,
          width: 100,
          height: 100,
          fill: '#3b82f6',
        });
      } else {
        shape = new fabric.Circle({
          left: 100,
          top: 100,
          radius: 50,
          fill: '#3b82f6',
        });
      }

      canvas.add(shape);
      canvas.setActiveObject(shape);
      canvas.renderAll();
      autoSave();
    },
    [autoSave]
  );

  // Add Text
  const addText = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const text = new fabric.IText('Text', {
      left: 100,
      top: 100,
      fontSize: 20,
      fill: '#000000',
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
    autoSave();
  }, [autoSave]);

  // Add Image from URL
  const addImageFromUrl = useCallback(
    async (url: string) => {
      const canvas = fabricCanvasRef.current;
      if (!canvas) return;

      const img = await fabric.Image.fromURL(url, {
        crossOrigin: 'anonymous',
      });

      img.set({
        left: 100,
        top: 100,
        scaleX: 0.5,
        scaleY: 0.5,
      });

      canvas.add(img);
      canvas.setActiveObject(img);
      canvas.renderAll();
      autoSave();
    },
    [autoSave]
  );

  // Add Image from File
  const addImageFromFile = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataUrl = e.target?.result as string;
        if (dataUrl) {
          await addImageFromUrl(dataUrl);
        }
      };
      reader.readAsDataURL(file);
    },
    [addImageFromUrl]
  );

  // Delete selected object
  const deleteSelected = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      canvas.remove(activeObject);
      canvas.renderAll();
      autoSave();
    }
  }, [autoSave]);

  // Duplicate selected object
  const duplicateSelected = useCallback(async() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;

    const cloned = await activeObject.clone();

    cloned.set({
    left: (cloned.left || 0) + 10,
    top: (cloned.top || 0) + 10,
    });

    canvas.add(cloned);
    canvas.setActiveObject(cloned);
    canvas.renderAll();
    autoSave();
  }, [autoSave]);

  // Zoom
  const setZoom = useCallback((zoom: number) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const newZoom = Math.min(Math.max(0.1, zoom), 5);
    canvas.setZoom(newZoom);
    setCanvasState((prev) => ({ ...prev, scale: newZoom }));
  }, []);

  // Load canvas from JSON
  const loadFromJSON = useCallback((json: string) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    canvas.loadFromJSON(json, () => {
      canvas.renderAll();
    });
  }, []);

  // Get canvas as JSON
  const getCanvasJSON = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return null;

    return canvas.toJSON();
  }, []);

  // Clear canvas
  const clearCanvas = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    canvas.clear();
    canvas.backgroundColor = '#FAFAFA';
    canvas.renderAll();
    autoSave();
  }, [autoSave]);

  return {
    fabricCanvasRef,
    initCanvas,
    activeTool,
    setActiveTool,
    canvasState,
    setCanvasState,
    isDragging,
    setIsDragging,
    addShape,
    addText,
    addImageFromUrl,
    addImageFromFile,
    deleteSelected,
    duplicateSelected,
    setZoom,
    loadFromJSON,
    getCanvasJSON,
    clearCanvas,
    selectedObjectId,
  };
};
