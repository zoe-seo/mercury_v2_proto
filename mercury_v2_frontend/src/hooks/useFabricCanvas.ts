import { useState, useCallback, useRef, useEffect } from 'react';
import * as fabric from 'fabric';
import { useCanvasStore } from '../store/canvasStore';
import { 
  useUpdateCanvasProject, 
  useCreateLayer, 
  useUpdateLayer, 
  useDeleteLayer 
} from '../queries/useCanvas';
import { fabricObjectToLayerData } from '../utils/fabricUtils';

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
  
  // Refs for State Access inside Event Listeners
  const activeToolRef = useRef<ToolType>('select'); // Initialize with a default value
  const isEditModeRef = useRef(false); // Initialize with a default value
  const editTargetIdRef = useRef<string | null>(null); // Initialize with a default value

  const {
    activeTool,
    setActiveTool,
    selectedObjectId,
    setSelectedObjectId,
    setSavingState,
    brushSettings,
    addLayer,       // Store action
    removeLayer,    // Store action
    updateLayer,    // Store action
    layers,
    isEditMode,
    editTargetId,
  } = useCanvasStore();

  // Sync refs
  useEffect(() => {
    activeToolRef.current = activeTool;
  }, [activeTool]);

  useEffect(() => {
    isEditModeRef.current = isEditMode;
    editTargetIdRef.current = editTargetId;

    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    if (isEditMode && editTargetId) {
      // Enter Edit Mode: Lock everything
      canvas.selection = false;
      canvas.defaultCursor = 'crosshair';
      
      canvas.forEachObject((obj) => {
        // Lock all objects
        obj.selectable = false;
        obj.evented = false; // Don't allow events on other objects
        
        // Optional: Dim other objects?
        if ((obj as any).layerId !== editTargetId) {
          obj.opacity = 0.5;
        } else {
          obj.opacity = 1;
        }
      });
      
      // Clear selection visual
      // Check if discardActiveObject exists on canvas instance (it should)
      canvas.discardActiveObject();
      canvas.requestRenderAll();
      
    } else {
      // Exit Edit Mode: Restore
      // Only restore selection if not in Hand mode?
      // But activeTool check in global handler handles cursor.
      canvas.selection = true; 
      canvas.defaultCursor = 'default';
      
      canvas.forEachObject((obj) => {
        obj.selectable = true;
        obj.evented = true;
        obj.opacity = 1;
      });
      
      canvas.requestRenderAll();
    }

  }, [isEditMode, editTargetId]);

  const [canvasState, setCanvasState] = useState<CanvasState>({
    scale: 1,
    offset: { x: 0, y: 0 },
  });

  const [isDragging, setIsDragging] = useState(false);

  // Drawing state for custom brush implementation
  const isDrawingRef = useRef(false);
  const currentPathRef = useRef<fabric.Path | null>(null);
  const drawingPointsRef = useRef<{ x: number; y: number }[]>([]);
  const drawingTargetRef = useRef<fabric.Object | null>(null);
  // Persist target ID even if selection is cleared visually
  const drawingTargetIdRef = useRef<string | null>(null);

  // API Mutations
  const { mutate: updateProject } = useUpdateCanvasProject();
  const { mutate: createLayer } = useCreateLayer();
  const { mutate: updateLayerMutate } = useUpdateLayer();
  const { mutate: deleteLayerMutate } = useDeleteLayer();

  // Debounced update for object modification
  const updateTimeoutRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  // Debounced auto-save (Viewport state only)
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const autoSaveViewport = useCallback(() => {
    if (!canvasId || canvasId === 'new' || !fabricCanvasRef.current) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    setSavingState('saving');

    saveTimeoutRef.current = setTimeout(() => {
      const canvas = fabricCanvasRef.current;
      if (!canvas) return;

      const currentZoom = canvas.getZoom();
      
      updateProject(
        {
          canvasId,
          data: {
            canvas_state: {
              viewport: {
                x: 0, // In a real app we'd save tracking/offset
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
  }, [canvasId, updateProject, setSavingState]);

  // Object Modification Handler (for Update API)
  const handleObjectModified = useCallback((obj: fabric.Object) => {
    if (!canvasId || !(obj as any).layerId) return;
    
    const layerId = (obj as any).layerId;

    // Clear existing timeout for this layer to debounce
    if (updateTimeoutRef.current[layerId]) {
      clearTimeout(updateTimeoutRef.current[layerId]);
    }

    setSavingState('saving');
    
    // Convert to Server Data
    const layerData = fabricObjectToLayerData(obj); 

    updateTimeoutRef.current[layerId] = setTimeout(() => {
      updateLayerMutate({
        canvasId,
        layerId,
        data: {
          layer_data: layerData 
        }
      }, {
        onSuccess: () => {
          setSavingState('saved');
          // Update store logic if needed
        },
        onError: () => setSavingState('error')
      });
      // Cleanup
      delete updateTimeoutRef.current[layerId];
    }, 1000); // 1s debounce for layer updates

    autoSaveViewport(); // Also trigger viewport save
  }, [canvasId, updateLayerMutate, setSavingState, autoSaveViewport]);


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
      // Don't clear selection if we are in brush/eraser mode OR drawing mode
      // This preserves the "context" for the panel even if Fabric deselects the object visual
      const currentTool = activeToolRef.current;
      // Also check explicit "Edit Mode" flag if we are relying on that
      if (currentTool !== 'brush' && currentTool !== 'eraser' && !isEditModeRef.current) {
        setSelectedObjectId(null);
      }
    });

    canvas.on('object:modified', (e) => {
      if (e.target) handleObjectModified(e.target);
    });

    // Pan handling for Hand tool & Custom Drawing for Brush/Eraser
    let isPanning = false;
    let lastPosX = 0;
    let lastPosY = 0;



    canvas.on('mouse:down', (opt) => {
      const evt = opt.e;
      const pointer = (opt as any).absolutePointer || { x: 0, y: 0 };
      const currentTool = activeToolRef.current;
      
      console.log('Global MouseDown:', { tool: currentTool, isEditMode: isEditModeRef.current, editTarget: editTargetIdRef.current });

      // Hand tool panning - GLOBAL PRIORITY
      if (currentTool === 'hand' && 'clientX' in evt && 'clientY' in evt) {
        isPanning = true;
        canvas.selection = false;
        canvas.defaultCursor = 'grabbing';
        lastPosX = evt.clientX;
        lastPosY = evt.clientY;
        return;
      }

      // Edit Mode Drawing - LOCAL PRIORITY
      if (isEditModeRef.current && editTargetIdRef.current) {
        const targetId = editTargetIdRef.current;
        const activeObject = canvas.getObjects().find((obj) => (obj as any).layerId === targetId);

        if (activeObject && ((activeObject as any).layerType === 'sketch' || (activeObject as any).layerType === 'image')) {
          const scenePointer = (opt as any).scenePoint || pointer;
          const pointObj = new fabric.Point(scenePointer.x, scenePointer.y);
          
          if (activeObject.containsPoint(pointObj)) {
            isDrawingRef.current = true;
            drawingTargetRef.current = activeObject; 
            drawingTargetIdRef.current = targetId; // Keep sync
            drawingPointsRef.current = [{ x: scenePointer.x, y: scenePointer.y }];
            
            // NOTE: Local tool state (brush vs eraser) should be passed or stored in store?
            // For now assuming Brush is default in Edit Mode, or we need access to context tool state.
            // But context tool loop is inside ContextToolbar...
            // Refactoring: user should probably select tool in ContextToolbar which sets a store value?
            // or we assume simple brush for now.
            // Let's assume 'brush' is default if isEditMode is true.
            // Ideally we need `activeContextTool` in store.
            // Adding TODO: Need context tool state. Using default brush settings.
            
            const pathString = `M ${scenePointer.x} ${scenePointer.y}`;
            const path = new fabric.Path(pathString, {
              stroke: brushSettings.color, // Use store settings
              strokeWidth: brushSettings.size,
              fill: null,
              selectable: false,
              evented: false,
              globalCompositeOperation: 'source-over', // TODO: Support Eraser from Context
              opacity: 1, 
              strokeLineCap: 'round',
              strokeLineJoin: 'round'
            });
            
            currentPathRef.current = path;
            canvas.add(path);
          }
        }
      }
    });

    canvas.on('mouse:move', (opt) => {
      const evt = opt.e;
      const currentTool = activeToolRef.current;
      
      if (isPanning && currentTool === 'hand') {
        if ('clientX' in evt && 'clientY' in evt) {
          const vpt = canvas.viewportTransform;
          if (vpt) {
            vpt[4] += evt.clientX - lastPosX;
            vpt[5] += evt.clientY - lastPosY;
            canvas.requestRenderAll();
            lastPosX = evt.clientX;
            lastPosY = evt.clientY;
          }
        }
        return;
      }

      // Edit Mode Drawing
      if (isDrawingRef.current && currentPathRef.current && drawingTargetRef.current) {
        const activeObject = drawingTargetRef.current;
        const pointer = (opt as any).scenePoint || (opt as any).absolutePointer || { x: 0, y: 0 };
        const pointObj = new fabric.Point(pointer.x, pointer.y);
        
        if (activeObject.containsPoint(pointObj)) {
          drawingPointsRef.current.push({ x: pointer.x, y: pointer.y });
          
          const pathString = drawingPointsRef.current.reduce((acc, point, index) => {
            if (index === 0) return `M ${point.x} ${point.y}`;
            return `${acc} L ${point.x} ${point.y}`;
          }, '');
          
          currentPathRef.current.path = fabric.util.parsePath(pathString) as any;
          canvas.requestRenderAll();
        }
      }
    });

    canvas.on('mouse:up', () => {
      if (isPanning) {
        isPanning = false;
        canvas.defaultCursor = 'grab';
        autoSaveViewport();
        return;
      }

      if (isDrawingRef.current && currentPathRef.current) {
        isDrawingRef.current = false;
        
        const finishedPath = currentPathRef.current;
        const activeObject = drawingTargetRef.current;
        
        if (activeObject && (activeObject as any).layerId) {
          const layerId = (activeObject as any).layerId;
          
          const pathData = {
            d: finishedPath.path?.reduce((acc: string, segment: any) => {
              if (Array.isArray(segment)) {
                const command = segment[0];
                const coords = segment.slice(1).join(' ');
                return `${acc} ${command} ${coords}`;
              }
              return acc;
            }, '').trim() || '',
            stroke: finishedPath.stroke || brushSettings.color,
            'stroke-width': finishedPath.strokeWidth || brushSettings.size,
            fill: 'none',
          };
          
          const currentLayer = layers.find(l => l.id === layerId);
          if (currentLayer && currentLayer.layer_type === 'sketch') {
            const currentPaths = (currentLayer.layer_data as any).paths || [];
            const updatedPaths = [...currentPaths, pathData];
            
            setSavingState('saving');
            updateLayerMutate({
              canvasId: canvasId!,
              layerId,
              data: {
                layer_data: {
                  ...(currentLayer.layer_data as any),
                  paths: updatedPaths,
                }
              }
            }, {
              onSuccess: () => {
                setSavingState('saved');
                updateLayer(layerId, {
                  layer_data: {
                    ...(currentLayer.layer_data as any),
                    paths: updatedPaths,
                  }
                });
              },
              onError: (err) => {
                canvas.remove(finishedPath);
                canvas.renderAll();
                setSavingState('error');
              }
            });
          }
        }
        
        currentPathRef.current = null;
        drawingPointsRef.current = [];
        drawingTargetRef.current = null; 
      }
    });

    // Note: object:added is tricky because we add object first then call API. 
    // We handle creation explicitly in add functions nicely.
    
    // Zoom/Pan handling
    canvas.on('mouse:wheel', (opt) => {
      const delta = opt.e.deltaY;
      let zoom = canvas.getZoom();
      zoom *= 0.999 ** delta;
      if (zoom > 5) zoom = 5;
      if (zoom < 0.1) zoom = 0.1;
      
      canvas.zoomToPoint(new fabric.Point(opt.e.offsetX, opt.e.offsetY), zoom);
      opt.e.preventDefault();
      opt.e.stopPropagation();
      setCanvasState(prev => ({ ...prev, scale: zoom }));
      autoSaveViewport();
    });

    return () => {
      canvas.dispose();
      fabricCanvasRef.current = null;
    };
  }, [setSelectedObjectId, autoSaveViewport]); // Removed handleObjectModified, activeTool to prevent recreation

  // Tool Handlers
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    // Reset drawing mode
    canvas.isDrawingMode = false;
    canvas.selection = true;
    canvas.defaultCursor = 'default';

    // Capture target for drawing if switching to brush/eraser
    if (activeTool === 'brush' || activeTool === 'eraser') {
      const activeObj = canvas.getActiveObject();
      if (activeObj && (activeObj as any).layerId) {
        drawingTargetIdRef.current = (activeObj as any).layerId;
      } else if (selectedObjectId) {
        drawingTargetIdRef.current = selectedObjectId;
      }
      console.log('Locked drawing target:', drawingTargetIdRef.current);
    } else {
      drawingTargetIdRef.current = null;
    }

    // Make all objects selectable/non-selectable based on tool
    const makeObjectsSelectable = (selectable: boolean) => {
      canvas.forEachObject((obj) => {
        obj.selectable = selectable;
        obj.evented = selectable;
        // Force visibility to be true just in case Fabric hidden it
        obj.visible = true; 
      });
    };

    switch (activeTool) {
      case 'select':
        canvas.defaultCursor = 'default';
        canvas.hoverCursor = 'move';
        canvas.isDrawingMode = false;
        makeObjectsSelectable(true);
        break;

      case 'hand':
        canvas.defaultCursor = 'grab';
        canvas.selection = false;
        canvas.isDrawingMode = false;
        makeObjectsSelectable(false);
        break;

      case 'brush':
        // Custom drawing - don't use isDrawingMode
        canvas.isDrawingMode = false; // Explicitly set false again
        canvas.defaultCursor = 'crosshair';
        canvas.selection = false;
        canvas.hoverCursor = 'crosshair';
        makeObjectsSelectable(false);
        break;

      case 'eraser':
        // Custom erasing - don't use isDrawingMode
        canvas.isDrawingMode = false; // Explicitly set false again
        canvas.defaultCursor = 'crosshair';
        canvas.selection = false;
        canvas.hoverCursor = 'crosshair';
        makeObjectsSelectable(false);
        break;
        
      default: 
        canvas.isDrawingMode = false;
        makeObjectsSelectable(true);
        break;
    }
    
    canvas.renderAll(); // Force immediate render
  }, [activeTool, brushSettings]);

  // --- NODE CREATION ACTIONS ---

  // Add Sketch Node
  const addSketchNode = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !canvasId) return;

    // Get Center of Viewport
    const center = canvas.getVpCenter();
    const width = 768;
    const height = 768;
    
    // 1. Create Fabric Object
    const rect = new fabric.Rect({
      left: center.x - (width / 2),
      top: center.y - (height / 2),
      width: width,
      height: height,
      fill: '#ffffff',
      stroke: '#D4D4D4',
      strokeWidth: 2,
      strokeDashArray: [10, 10],
      selectable: true,
    });
    
    // 2. Add to Canvas
    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.renderAll();

    // 3. Call API to Create Layer
    setSavingState('saving');
    
    const layerDataPayload = {
        x: rect.left,
        y: rect.top,
        width: width,
        height: height,
        paths: [], // Required by backend API
        fabric_json: rect.toJSON(),
    };

    createLayer({
      canvasId,
      data: {
        layer_type: 'sketch',
        layer_data: layerDataPayload,
        z_index: layers.length + 1
      }
    }, {
      onSuccess: (newLayer) => {
        // 4. Update ID and Store
        (rect as any).layerId = newLayer.id;
        (rect as any).layerType = 'sketch';
        addLayer(newLayer);
        setSavingState('saved');
      },
      onError: (err) => {
        console.error('Failed to create sketch layer', err);
        canvas.remove(rect);
        canvas.renderAll();
        setSavingState('error');
      }
    });

  }, [canvasId, layers.length, createLayer, addLayer, setSavingState]);

  // Add Text Node
  const addText = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !canvasId) return;

    const center = canvas.getVpCenter();

    const text = new fabric.IText('Double click to edit', {
      left: center.x,
      top: center.y,
      fontSize: 20,
      fontFamily: 'Inter',
      fill: '#000000',
      originX: 'center',
      originY: 'center',
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();

    setSavingState('saving');

    const layerDataPayload = {
      x: text.left,
      y: text.top,
      text: text.text,
      font_size: text.fontSize,
      font_family: text.fontFamily,
      fill: text.fill ? String(text.fill) : '#000000',
      fabric_json: text.toJSON()
    };

    createLayer({
      canvasId,
      data: {
        layer_type: 'text',
        layer_data: layerDataPayload,
        z_index: layers.length + 1
      }
    }, {
      onSuccess: (newLayer) => {
        (text as any).layerId = newLayer.id;
        (text as any).layerType = 'text';
        addLayer(newLayer);
        setSavingState('saved');
      },
      onError: () => {
         canvas.remove(text);
         canvas.renderAll();
         setSavingState('error');
      }
    });
  }, [canvasId, layers.length, createLayer, addLayer, setSavingState]);

  // Add Shape (Legacy/Auxiliary)
  const addShape = useCallback(() => {
      // NOTE: For now mapping shape to 'sketch' or ignoring API as per spec simplicity
      // But let's unimplemented it or assume similar flow if needed.
      // Leaving as is but using center logic
      // Placeholder
  }, []); 

  // Add Image from URL
  const addImageFromUrl = useCallback(
    async (url: string) => {
      const canvas = fabricCanvasRef.current;
      if (!canvas || !canvasId) return;

      const center = canvas.getVpCenter();

      // 1. Load Image
      const img = await fabric.Image.fromURL(url, {
        crossOrigin: 'anonymous',
      });

      // Resize logic if needed (fit to 768 max)
      const scale = 768 / Math.max(img.width || 1, img.height || 1);
      
      img.set({
        left: center.x - ((img.width || 0) * scale) / 2,
        top: center.y - ((img.height || 0) * scale) / 2,
        scaleX: scale,
        scaleY: scale,
      });

      canvas.add(img);
      canvas.setActiveObject(img);
      canvas.renderAll();

      setSavingState('saving');

      // 2. Upload/Create Layer
      // NOTE: In real flow, image upload API returns URL, then we call createLayer.
      // Here we assume URL is already remote or bloblocal.
      
      createLayer({
        canvasId,
        data: {
          layer_type: 'image',
          layer_data: {
            image_url: url,
            source: 'upload',
            x: img.left,
            y: img.top,
            width: img.getScaledWidth(),
            height: img.getScaledHeight(),
            scale_x: img.scaleX,
            scale_y: img.scaleY,
            rotation: img.angle,
            fabric_json: img.toJSON()
          },
          z_index: layers.length + 1
        }
      }, {
        onSuccess: (newLayer) => {
          (img as any).layerId = newLayer.id;
          (img as any).layerType = 'image';
          addLayer(newLayer);
          setSavingState('saved');
        },
        onError: () => {
          canvas.remove(img);
          setSavingState('error');
        }
      });
    },
    [canvasId, layers.length, createLayer, addLayer, setSavingState]
  );

  // Add Image from File
  const addImageFromFile = useCallback(
    (file: File) => {
      // NOTE: In a real app, upload file first to get URL.
      // For Prototype, read as dataURL and create layer.
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
    if (!canvas || !canvasId) return;

    const activeObject = canvas.getActiveObject();
    if (!activeObject || !(activeObject as any).layerId) return;

    const layerId = (activeObject as any).layerId;

    // Optimistic Remove
    canvas.remove(activeObject);
    canvas.discardActiveObject();
    canvas.renderAll();
    removeLayer(layerId); // Store update

    setSavingState('saving');
    
    deleteLayerMutate({ canvasId, layerId }, {
      onSuccess: () => setSavingState('saved'),
      onError: () => {
         setSavingState('error');
         // Rollback logic would go here (fetch layer again)
      }
    });

  }, [canvasId, removeLayer, deleteLayerMutate, setSavingState]);

  // Duplicate - Simplified placeholder
  const duplicateSelected = useCallback(async() => {
    // TODO: Implement duplicate with API call similar to create
  }, []);

  // Zoom
  const setZoom = useCallback((zoom: number) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const newZoom = Math.min(Math.max(0.1, zoom), 5);
    canvas.setZoom(newZoom);
    setCanvasState((prev) => ({ ...prev, scale: newZoom }));
    autoSaveViewport();
  }, [autoSaveViewport]);

  // Standard Helpers
  const loadFromJSON = useCallback((json: string) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    canvas.loadFromJSON(json, () => canvas.renderAll());
  }, []);

  const getCanvasJSON = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return null;
    return canvas.toJSON();
  }, []);

  const clearCanvas = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    canvas.clear();
    canvas.backgroundColor = '#FAFAFA';
    canvas.renderAll();
  }, []);


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
    addSketchNode,
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
