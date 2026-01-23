import { useParams } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { CanvasLayout } from '../components/canvas/CanvasLayout';
import { CanvasBoard } from '../components/canvas/CanvasBoard';
import { TopToolbar } from '../components/canvas/TopToolbar';
import { LayerPanel } from '../components/canvas/LayerPanel';
import { AIPromptPanel } from '../components/canvas/AIPromptPanel';
import { useCanvas } from '../hooks/useCanvas';

export const CanvasPage = () => {
  // const { projectId } = useParams();
  const canvasLogic = useCanvas();

  return (
    <Layout>
      <CanvasLayout>
         <TopToolbar activeTool={canvasLogic.activeTool} setActiveTool={canvasLogic.setActiveTool} />
         <LayerPanel />
         <CanvasBoard logic={canvasLogic} />
         <AIPromptPanel />
      </CanvasLayout>
    </Layout>
  );
};
