import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { CanvasLayout } from '../components/canvas/CanvasLayout';
import { CanvasBoard } from '../components/canvas/CanvasBoard';
import { TopToolbar } from '../components/canvas/TopToolbar';
import { PropertiesPanel } from '../components/canvas/PropertiesPanel';
import { LayerPanel } from '../components/canvas/LayerPanel';
import { ImageContextPanel } from '../components/canvas/ImageContextPanel';
import { SpecSidePanel } from '../components/canvas/SpecSidePanel';
import { DesignPackageModal } from '../components/workshop/DesignPackageModal';
import { useFabricCanvas } from '../hooks/useFabricCanvas';
import { useCanvasStore } from '../store/canvasStore';
import { useCanvasProject, useUpdateCanvasProject } from '../queries/useCanvas';
import { useKeyboardShortcuts, createCanvasShortcuts } from '../utils/keyboardShortcuts';
import { layerDataToFabricObject, loadImageFromUrl } from '../utils/fabricUtils';
import type { CanvasLayer, ImageLayerData } from '../types/api/canvas';

export const CanvasPage = () => {
  const { canvasId } = useParams<{ canvasId: string }>();
  const navigate = useNavigate();

  // Redirect if no canvasId
  useEffect(() => {
    if (!canvasId) {
      navigate('/');
    }
  }, [canvasId, navigate]);

  const {
    fabricCanvasRef,
    initCanvas,
    activeTool,
    setActiveTool,
    canvasState,
    setZoom,
    addText,
    addSketchNode,
    addImageFromFile,
    deleteSelected,
    duplicateSelected,
  } = useFabricCanvas(canvasId);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    selectedObjectId,
    canUndo,
    canRedo,
    undo,
    redo,
    savingState,
    setLayers,
    layers,
  } = useCanvasStore();

  const [isAIPanelOpen, setIsAIPanelOpen] = useState(false);
  const [isWorkshopOpen, setIsWorkshopOpen] = useState(false);
  const [aiPanelPosition, setAIPanelPosition] = useState<{ x: number; y: number } | undefined>(undefined);

  // Calculate AI Panel position based on selected object
  useEffect(() => {
    if (selectedObjectId && fabricCanvasRef.current && isAIPanelOpen) {
      const canvas = fabricCanvasRef.current;
      const activeObject = canvas.getActiveObject();
      
      if (activeObject) {
        // Get object bounds in canvas coordinates
        const bounds = activeObject.getBoundingRect();
        const zoom = canvas.getZoom();
        
        // Convert to viewport coordinates
        const vpt = canvas.viewportTransform;
        if (vpt) {
          const x = bounds.left * zoom + vpt[4] + bounds.width * zoom / 2;
          const y = bounds.top * zoom + vpt[5] + bounds.height * zoom;
          
          setAIPanelPosition({ x, y });
        }
      }
    } else {
      setAIPanelPosition(undefined);
    }
  }, [selectedObjectId, fabricCanvasRef, isAIPanelOpen]);

  // Load canvas project data
  const { data: projectData, isLoading } = useCanvasProject(canvasId);
  const { mutate: updateProject } = useUpdateCanvasProject();

  // Load layers into canvas when project data is fetched
  useEffect(() => {
    if (projectData && fabricCanvasRef.current && projectData.layers) {
      const canvas = fabricCanvasRef.current;
      canvas.clear();
      // Set bg color explicitly
      canvas.backgroundColor = '#FAFAFA';

      // Set layers in store
      setLayers(projectData.layers);

      // Load layers into Fabric canvas
      projectData.layers.forEach(async (layer: CanvasLayer) => {
        if (layer.layer_type === 'image' || ((layer as any).layer_type === 'generated')) {
          // Load image asynchronously
          const layerData = layer.layer_data as ImageLayerData;
          if (layerData.image_url) {
            try {
              const img = await loadImageFromUrl(layerData.image_url, {
                left: layerData.x || 0,
                top: layerData.y || 0,
                selectable: !layer.is_locked,
                evented: !layer.is_locked,
                opacity: layer.opacity || 1,
              });
              (img as any).layerId = layer.id;
              (img as any).layerType = layer.layer_type;
              canvas.add(img);
              canvas.renderAll();
            } catch (error) {
              console.error('Failed to load image:', error);
            }
          }
        } else {
          // Sketch or Text
          const fabricObj = layerDataToFabricObject(layer);
          if (fabricObj) {
            canvas.add(fabricObj);
          }
        }
      });

      canvas.renderAll();
    }
  }, [projectData, fabricCanvasRef, setLayers]);

  // AI Panel conditional activation
  useEffect(() => {
    if (selectedObjectId) {
      const layer = layers.find((l) => l.id === selectedObjectId);
      if (layer && (layer.layer_type === 'image' || (layer as any).layer_type === 'generated')) {
        setIsAIPanelOpen(true);
      } else {
        setIsAIPanelOpen(false);
      }
    } else {
      setIsAIPanelOpen(false);
    }
  }, [selectedObjectId, layers]);

  // Sync canvas with layers (Deletion handling)
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const currentObjects = canvas.getObjects();
    const currentLayerIds = new Set(layers.map(l => l.id));

    let removed = false;
    currentObjects.forEach((obj) => {
      const layerId = (obj as any).layerId;
      // Only remove objects that have a layerId (managed objects) AND are not in current layers
      if (layerId && !currentLayerIds.has(layerId)) {
        console.log('Syncing deletion: removing object', layerId);
        canvas.remove(obj);
        removed = true;
      }
    });

    if (removed) {
      canvas.requestRenderAll();
    }
  }, [layers, fabricCanvasRef]);

  // Keyboard shortcuts
  useKeyboardShortcuts(
    createCanvasShortcuts({
      onSelectTool: () => setActiveTool('select'),
      onHandTool: () => setActiveTool('hand'),
      onBrushTool: () => setActiveTool('brush'),
      onEraserTool: () => setActiveTool('eraser'),
      // Shape tool removed from shortcuts as it's not in main toolbar? 
      // Or map 'R' to addSketchNode? Spec says 'R' is Rectangle..
      // We'll keep default mappings or adjust if needed.
      onShapeTool: () => {
         // Maybe add generic shape if needed, or map to sketch node?
         // For now keeping usage of addShape('rect') if user presses R
        // addShape('rect'); // Shape tool shortcut removed (legacy / unused)
        setActiveTool('select');
      },
      onTextTool: () => {
        addText();
        setActiveTool('select');
      },
      onImageTool: () => fileInputRef.current?.click(),
      onUndo: () => {
        const state = undo();
        if (state && fabricCanvasRef.current) {
          fabricCanvasRef.current.loadFromJSON(state, () => {
            fabricCanvasRef.current?.renderAll();
          });
        }
      },
      onRedo: () => {
        const state = redo();
        if (state && fabricCanvasRef.current) {
          fabricCanvasRef.current.loadFromJSON(state, () => {
            fabricCanvasRef.current?.renderAll();
          });
        }
      },
      onDuplicate: duplicateSelected,
      onGroup: () => console.log('Group'),
      onUngroup: () => console.log('Ungroup'),
      onDelete: deleteSelected,
      onZoomIn: () => setZoom(canvasState.scale + 0.1),
      onZoomOut: () => setZoom(canvasState.scale - 0.1),
      onResetZoom: () => setZoom(1),
    })
  );

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      addImageFromFile(file);
      // Reset input
      e.target.value = '';
    }
  };

  const handleRename = (newName: string) => {
    if (canvasId) {
      updateProject({ canvasId, data: { name: newName } });
    }
  };

  if (isLoading) {
    return (
      <Layout className="h-screen overflow-hidden">
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-500">Loading canvas...</div>
        </div>
      </Layout>
    );
  }

  const selectedLayer = layers.find(l => l.id === selectedObjectId);
  let initialImage = '';
  if (selectedLayer) {
     if (selectedLayer.layer_type === 'image') {
         initialImage = (selectedLayer.layer_data as ImageLayerData).image_url || '';
     } else if ((selectedLayer as any).layer_type === 'generated') {
         initialImage = (selectedLayer.layer_data as any).image_url || '';
     }
  }

  return (
    <Layout className="h-screen overflow-hidden">
      {/* Hidden file input for image upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
      <CanvasLayout>
        {/* Main Board */}
        <CanvasBoard 
          initCanvas={initCanvas}
          fabricCanvasRef={fabricCanvasRef}
          canvasState={canvasState}
        />

        {/* Floating Toolbar */}
        <TopToolbar
          activeTool={activeTool}
          setActiveTool={setActiveTool}
          scale={canvasState.scale}
          setScale={setZoom}
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={() => {
            const state = undo();
            if (state && fabricCanvasRef.current) {
              fabricCanvasRef.current.loadFromJSON(state, () => {
                fabricCanvasRef.current?.renderAll();
              });
            }
          }}
          onRedo={() => {
            const state = redo();
            if (state && fabricCanvasRef.current) {
              fabricCanvasRef.current.loadFromJSON(state, () => {
                fabricCanvasRef.current?.renderAll();
              });
            }
          }}
          onExport={() => console.log('Export')}
          savingState={savingState}
          
          // New Props
          canvasName={projectData?.name}
          onRename={handleRename}
          nodeCount={layers.length}
          onAddSketchNode={addSketchNode}
          onAddTextNode={addText}
          onUploadImage={() => fileInputRef.current?.click()}
        />

        {/* Context Panels */}
        <PropertiesPanel
          activeTool={activeTool}
          selectedObject={selectedObjectId ? { id: selectedObjectId } : undefined}
          canvasId={canvasId}
        />

        {/* Right Side Panels */}
        <LayerPanel canvasId={canvasId} />

        {/* Left Side Panel - Design Brief */}
        <SpecSidePanel 
          canvasId={canvasId} 
          isOpen={true} // Always open for now, or use state
        />

        {/* Unified Image Context Panel */}
        <ImageContextPanel
          canvasId={canvasId}
          isOpen={isAIPanelOpen}
          onClose={() => setIsAIPanelOpen(false)}
          onCreatePackage={() => setIsWorkshopOpen(true)}
          position={aiPanelPosition}
          selectedObjectId={selectedObjectId || undefined}
        />

        {/* Design Packaging Workshop Modal */}
        <DesignPackageModal
          isOpen={isWorkshopOpen}
          onClose={() => setIsWorkshopOpen(false)}
          canvasId={canvasId!}
          initialImage={initialImage}
        />
      </CanvasLayout>
    </Layout>
  );
};
