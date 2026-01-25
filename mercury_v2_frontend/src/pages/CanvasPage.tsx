import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { CanvasLayout } from '../components/canvas/CanvasLayout';
import { CanvasBoard } from '../components/canvas/CanvasBoard';
import { TopToolbar } from '../components/canvas/TopToolbar';
import { PropertiesPanel } from '../components/canvas/PropertiesPanel';
import { LayerPanel } from '../components/canvas/LayerPanel';
import { SegmentsPanel } from '../components/canvas/SegmentsPanel';
import { AIPromptPanel } from '../components/canvas/AIPromptPanel';
import { DesignPackagingWorkshop } from '../components/canvas/DesignPackagingWorkshop';
import { useCanvas } from '../hooks/useCanvas';

export const CanvasPage = () => {
  const { projectId } = useParams<{ projectId?: string }>();
  const canvasId = projectId || 'new';
  const canvasLogic = useCanvas();
  const { activeTool, setActiveTool, canvasState, setCanvasState } = canvasLogic;
  
  const [selectedObjectId] = useState<string | null>(null);
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(true);
  const [isWorkshopOpen, setIsWorkshopOpen] = useState(false);

  // Mock Undo/Redo
  const handleUndo = () => console.log('Undo');
  const handleRedo = () => console.log('Redo');
  const handleExport = () => console.log('Export');

  return (
    <Layout className="h-screen overflow-hidden">
      <CanvasLayout>
         {/* Main Board */}
         <CanvasBoard logic={canvasLogic} />

         {/* Floating Toolbar */}
         <TopToolbar 
            activeTool={activeTool} 
            setActiveTool={setActiveTool} 
            scale={canvasState.scale}
            setScale={(s) => setCanvasState(prev => ({ ...prev, scale: s }))}
            canUndo={true}
            canRedo={false}
            onUndo={handleUndo}
            onRedo={handleRedo}
            onExport={handleExport}
         />

         {/* Context Panels */}
         <PropertiesPanel 
            activeTool={activeTool} 
            selectedObject={selectedObjectId ? { id: selectedObjectId } : undefined}
         />

         {/* Right Side Panels */}
         <LayerPanel />
         <SegmentsPanel onSegmentClick={(id) => {
             console.log('Selected segment:', id);
             setIsAIPanelOpen(true);
         }} />

         {/* AI Popup - Centered for mock or floating near selection */}
         <AIPromptPanel 
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
