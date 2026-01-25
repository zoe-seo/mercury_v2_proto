import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { CanvasLayout } from '../components/canvas/CanvasLayout';
import { CanvasBoard } from '../components/canvas/CanvasBoard';
import { TopToolbar } from '../components/canvas/TopToolbar';
import { PropertiesPanel } from '../components/canvas/PropertiesPanel';
import { LayerPanel } from '../components/canvas/LayerPanel';
import { SegmentsPanel } from '../components/canvas/SegmentsPanel';
import { AIPromptPanel } from '../components/canvas/AIPromptPanel';
import { DesignPackagingWorkshop } from '../components/canvas/DesignPackagingWorkshop';
import { useFabricCanvas } from '../hooks/useFabricCanvas';
import { useCanvasStore } from '../store/canvasStore';
import { useCanvasProject } from '../queries/useCanvas';
import { useKeyboardShortcuts, createCanvasShortcuts } from '../utils/keyboardShortcuts';
import { layerDataToFabricObject, loadImageFromUrl } from '../utils/fabricUtils';

export const CanvasPage = () => {
  const { canvasId } = useParams<{ canvasId: string }>();
  const navigate = useNavigate();

  // canvasId가 없으면 홈으로 리다이렉트
  useEffect(() => {
    if (!canvasId) {
      navigate('/');
    }
  }, [canvasId, navigate]);

  const {
    fabricCanvasRef,
    activeTool,
    setActiveTool,
    canvasState,
    setZoom,
    addShape,
    addText,
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

  // Load canvas project data
  const { data: projectData, isLoading } = useCanvasProject(canvasId);

  // Load layers into canvas when project data is fetched
  useEffect(() => {
    if (projectData && fabricCanvasRef.current && projectData.layers) {
      const canvas = fabricCanvasRef.current;
      canvas.clear();

      // Set layers in store
      setLayers(projectData.layers);

      // Load layers into Fabric canvas
      projectData.layers.forEach(async (layer) => {
        if (layer.layer_type === 'image' || layer.layer_type === 'generated') {
          // Load image asynchronously
          if (layer.layer_data.image_url) {
            try {
              const img = await loadImageFromUrl(layer.layer_data.image_url, {
                left: layer.layer_data.x || 0,
                top: layer.layer_data.y || 0,
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
      if (layer && (layer.layer_type === 'image' || layer.layer_type === 'generated')) {
        setIsAIPanelOpen(true);
      } else {
        setIsAIPanelOpen(false);
      }
    } else {
      setIsAIPanelOpen(false);
    }
  }, [selectedObjectId, layers]);

  // Keyboard shortcuts
  useKeyboardShortcuts(
    createCanvasShortcuts({
      onSelectTool: () => setActiveTool('select'),
      onHandTool: () => setActiveTool('hand'),
      onBrushTool: () => setActiveTool('brush'),
      onEraserTool: () => setActiveTool('eraser'),
      onShapeTool: () => {
        addShape('rect');
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

  if (isLoading) {
    return (
      <Layout className="h-screen overflow-hidden">
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-500">Loading canvas...</div>
        </div>
      </Layout>
    );
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
        <CanvasBoard canvasId={canvasId} />

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
        />

        {/* Context Panels */}
        <PropertiesPanel
          activeTool={activeTool}
          selectedObject={selectedObjectId ? { id: selectedObjectId } : undefined}
          canvasId={canvasId}
        />

        {/* Right Side Panels */}
        <LayerPanel canvasId={canvasId} />
        <SegmentsPanel
          canvasId={canvasId}
          onSegmentClick={(id) => {
            console.log('Selected segment:', id);
            setIsAIPanelOpen(true);
          }}
        />

        {/* AI Popup */}
        <AIPromptPanel
          canvasId={canvasId}
          isOpen={isAIPanelOpen}
          onClose={() => setIsAIPanelOpen(false)}
          onCreatePackage={() => setIsWorkshopOpen(true)}
          position={{ x: window.innerWidth / 2, y: window.innerHeight - 200 }}
        />

        {/* Design Packaging Workshop Modal */}
        <DesignPackagingWorkshop
          isOpen={isWorkshopOpen}
          onClose={() => setIsWorkshopOpen(false)}
          canvasId={canvasId}
          selectedImageId={selectedObjectId || undefined}
        />
      </CanvasLayout>
    </Layout>
  );
};
