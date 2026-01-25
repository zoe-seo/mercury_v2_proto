import { motion, AnimatePresence } from 'framer-motion';
import {
  Wand2,
  X,
  Sparkles,
  Paintbrush,
  Loader2,
  Scan,
  Tag,
  ChevronDown,
  ChevronUp,
  Eraser,
  Brush,
  ArrowUp
} from 'lucide-react';
import { Button } from '../common/Button';
import { useState, useEffect } from 'react';
import { useGenerateImage, useInpaintImage, useTaskStatus, useSegmentation } from '../../queries/useCanvas';
import { useCanvasStore } from '../../store/canvasStore';
import { cn } from '../../utils/cn';

interface ImageContextPanelProps {
  canvasId: string | undefined;
  position?: { x: number; y: number };
  onClose?: () => void;
  isOpen?: boolean;
  onCreatePackage?: () => void;
  selectedObjectId?: string;
}

export const ImageContextPanel = ({
  canvasId,
  position,
  onClose,
  isOpen = true,
  onCreatePackage,
  selectedObjectId,
}: ImageContextPanelProps) => {
  const [prompt, setPrompt] = useState('');
  const [taskId, setTaskId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<'prompt' | 'tools'>('prompt');
  const [inpaintMode, setInpaintMode] = useState(false);
  const [activeTool, setActiveTool] = useState<'brush' | 'eraser'>('brush');

  const { 
    setEditMode, 
    segments, 
    setSegments, 
    setBrushSize,
    brushSettings
  } = useCanvasStore();

  const { mutate: generateImage, isPending: isGenerating } = useGenerateImage();
  const { mutate: inpaintImage, isPending: isInpainting } = useInpaintImage();
  const { mutate: requestSegmentation, isPending: isAnalyzing } = useSegmentation();

  // Poll task status
  const { data: taskStatus } = useTaskStatus(taskId, !!taskId);

  // Handle task completion
  useEffect(() => {
    if (taskStatus?.status === 'SUCCESS') {
      console.log('Generation complete:', taskStatus.result);
      setTaskId(null);
      setPrompt('');
      // TODO: Add generated image to canvas handling is usually done via invalidating queries or socket updates
    } else if (taskStatus?.status === 'FAILURE') {
      console.error('Generation failed:', taskStatus.error);
      setTaskId(null);
    }
  }, [taskStatus]);

  // Sync Inpaint Mode with Global Edit Mode
  useEffect(() => {
    if (inpaintMode && selectedObjectId) {
      setEditMode(true, selectedObjectId);
    } else {
      setEditMode(false, null);
    }
  }, [inpaintMode, selectedObjectId, setEditMode]);

  // Handle Generation
  const handleGenerate = () => {
    if (!canvasId || !prompt) return;

    if (inpaintMode && selectedObjectId) {
      // Inpainting
      inpaintImage(
        {
          canvasId,
          data: {
            layer_id: selectedObjectId,
            mask_data: { paths: [] }, // TODO: Get actual mask from canvas
            prompt,
            generation_params: { strength: 0.8 },
          },
        },
        {
          onSuccess: (response) => setTaskId(response.task_id),
        }
      );
    } else if (selectedObjectId) {
      // Image Variation (img2img) or just generation replacing layer?
      // For now assuming In-Place Generation behavior if not masking
       generateImage(
        {
          canvasId,
          data: {
            layer_ids: [selectedObjectId],
            prompt,
            generation_params: { strength: 0.7 },
          },
        },
        {
          onSuccess: (response) => setTaskId(response.task_id),
        }
      );
    }
  };

  // Handle Analysis
  const handleAnalyze = () => {
    if (!canvasId || !selectedObjectId) return;
    requestSegmentation(
      { canvasId, layerId: selectedObjectId },
      {
        onSuccess: (data) => setSegments(data.segments),
        onError: (err) => console.error('Segmentation failed', err),
      }
    );
  };

  if (!isOpen || !selectedObjectId) return null;

  const isProcessing = isGenerating || isInpainting || !!taskId;
  const isAnalyzed = segments.length > 0;

  // Position Logic
  // Position Logic
  let panelStyle: React.CSSProperties = {
      left: '50%',
      top: 'calc(100% + 16px)', // Default below object
      transform: 'translateX(-50%)',
  };

  if (position) {
     // Use absolute positioning relative to viewport if provided
     // But for now, let's stick to the simpler fixed/absolute logic from AIPromptPanel
      panelStyle = {
        left: position.x,
        top: position.y + 20,
        transform: 'translateX(-50%)',
      };
      
      // Basic boundary check could go here similar to AIPromptPanel
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0, scale: 0.95 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: 20, opacity: 0, scale: 0.95 }}
      style={{
          position: 'absolute',
          ...panelStyle,
          zIndex: 50
      }}
      className="bg-white rounded-xl shadow-2xl border border-primary-100 p-0 flex flex-col w-[360px] pointer-events-auto overflow-hidden font-sans"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
        <span className="text-xs font-semibold text-gray-400 ml-1">Image Panel</span>
        <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400" onClick={onClose}>
            <X size={14} />
        </Button>
      </div>

       {/* 1. Prompt Section */}
       <div className="p-3 pb-2 flex gap-3 items-start">
          <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-indigo-500 rounded-lg flex items-center justify-center text-white shadow-sm shrink-0 mt-0.5">
           <Wand2 size={18} />
         </div>
         <div className="flex-1 relative bg-gray-50 rounded-xl border border-gray-200 focus-within:ring-1 focus-within:ring-primary-500 focus-within:border-primary-500 transition-all">
            <textarea
             placeholder={inpaintMode ? "Describe what to fill..." : "Describe changes..."}
             value={prompt}
             onChange={(e) => setPrompt(e.target.value)}
             className="w-full text-sm border-none focus:ring-0 placeholder-gray-400 p-2 pr-10 resize-none h-[42px] min-h-[42px] bg-transparent leading-relaxed custom-scrollbar py-2.5"
             style={{ maxHeight: '120px' }}
             disabled={isProcessing}
             onKeyDown={(e) => {
               if (e.key === 'Enter' && !e.shiftKey) {
                 e.preventDefault();
                 handleGenerate();
               }
             }}
           />
            <Button
             size="icon"
             className={cn(
               "absolute right-1.5 top-1/2 -translate-y-1/2 h-7 w-7 rounded-lg transition-all",
               prompt ? "bg-primary-600 hover:bg-primary-700 text-white shadow-sm" : "bg-gray-200 text-gray-400 cursor-not-allowed"
             )}
             onClick={handleGenerate}
             disabled={isProcessing || !prompt}
             title="Generate"
           >
             {isProcessing ? <Loader2 size={14} className="animate-spin" /> : <ArrowUp size={16} />}
           </Button>
         </div>
       </div>

       {/* Progress Bar (if processing) */}
      {taskStatus?.status === 'PROGRESS' && (
        <div className="mx-3 mb-3 bg-primary-50 rounded-lg p-2 text-xs text-primary-700">
           {/* Progress UI */}
           Processing... {((taskStatus.progress?.current || 0) / (taskStatus.progress?.total || 1) * 100).toFixed(0)}%
        </div>
      )}

      {/* 2. Tools & Masking Section */}
      <div className="border-t border-gray-100 bg-gray-50/50">
        <div 
            className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-50 transition-colors select-none"
            onClick={() => setActiveSection(activeSection === 'tools' ? 'prompt' : 'tools')}
        >
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                <Paintbrush size={14} className="text-indigo-500" />
                <span>Masking & Tools</span>
                {inpaintMode && <span className="bg-indigo-100 text-indigo-600 px-1.5 rounded text-[10px]">ON</span>}
            </div>
             {activeSection === 'tools' ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
        </div>

        <AnimatePresence>
            {activeSection === 'tools' && (
                <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-3 pb-3 overflow-hidden"
                >
                     {/* Mode Toggles */}
                     <div className="flex gap-1 mb-3 bg-gray-200/50 p-1 rounded-lg">
                        <button 
                            className={cn(
                                "flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-medium transition-all",
                                !inpaintMode ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700"
                            )}
                            onClick={() => setInpaintMode(false)}
                        >
                            <Scan size={14} />
                            Smart Select
                        </button>
                        <button 
                             className={cn(
                                "flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-medium transition-all",
                                inpaintMode ? "bg-white text-indigo-600 shadow-sm ring-1 ring-primary-100" : "text-gray-500 hover:text-gray-700"
                            )}
                            onClick={() => setInpaintMode(true)}
                        >
                             <Brush size={14} />
                             Manual Brush
                        </button>
                     </div>

                     {inpaintMode ? (
                         /* Manual Brush Controls */
                        <div className="space-y-3">
                            <div className="flex items-center justify-center gap-3">
                                 <button 
                                    className={cn("p-2 rounded-lg border", activeTool === 'brush' ? "bg-indigo-50 border-indigo-200 text-indigo-600" : "bg-white border-gray-200 text-gray-600")}
                                    onClick={() => setActiveTool('brush')}
                                 >
                                     <Brush size={18} />
                                 </button>
                                 <button 
                                     className={cn("p-2 rounded-lg border", activeTool === 'eraser' ? "bg-indigo-50 border-indigo-200 text-indigo-600" : "bg-white border-gray-200 text-gray-600")}
                                     onClick={() => setActiveTool('eraser')}
                                 >
                                     <Eraser size={18} />
                                 </button>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xs text-gray-500 w-8">Size</span>
                                <input 
                                    type="range" 
                                    min="1" max="100" 
                                    defaultValue={brushSettings.size}
                                    onChange={(e) => setBrushSize(parseInt(e.target.value))}
                                    className="flex-1 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-500" 
                                />
                                <span className="text-xs text-gray-500 w-6 text-right">{brushSettings.size}</span>
                            </div>
                        </div>
                     ) : (
                         /* Smart Select Controls */
                         <div>
                            {!isAnalyzed ? (
                                <Button 
                                    size="sm" 
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                                    onClick={handleAnalyze}
                                    disabled={isAnalyzing}
                                >
                                    {isAnalyzing ? <Loader2 size={14} className="animate-spin mr-2" /> : <Sparkles size={14} className="mr-2" />}
                                    Analyze Image Parts
                                </Button>
                            ) : (
                                <div className="space-y-2">
                                     <div className="flex justify-between items-center text-xs text-gray-500">
                                         <span>{segments.length} parts detected</span>
                                         <button onClick={() => setSegments([])} className="hover:text-red-500">Reset</button>
                                     </div>
                                     <div className="flex flex-wrap gap-2">
                                         {segments.map(seg => (
                                             <button 
                                                key={seg.id}
                                                className="px-2 py-1 bg-white border border-gray-200 rounded-full text-xs hover:border-indigo-300 hover:text-indigo-600 flex items-center gap-1"
                                                onClick={() => {
                                                    // TODO: Toggle mask for this segment
                                                    // For now just toggle inpaint mode as a stub for "Selection"
                                                    setInpaintMode(true);
                                                }}
                                             >
                                                <Tag size={10} />
                                                {seg.label}
                                             </button>
                                         ))}
                                     </div>
                                </div>
                            )}
                         </div>
                     )}
                </motion.div>
            )}
        </AnimatePresence>
      </div>

      {/* 3. Action Footer - Removed and moved to Input Area */}

      
       {/* Packaging Button (Optional) */}
       {onCreatePackage && (
           <div className="px-3 pb-3 bg-white flex flex-col gap-2 border-t border-gray-50 pt-3">
                <span className="text-[10px] text-gray-400 text-center font-medium">————— Create a design package with this image —————</span>
                <Button 
                    variant="secondary" 
                    size="sm" 
                    className="w-full bg-purple-500 cursor-pointer text-xs border-purple-200 text-white hover:bg-purple-600"
                    onClick={onCreatePackage}
                >
                    <Sparkles size={12} className="mr-2" />
                    Create Design Package
                </Button>
           </div>
       )}

    </motion.div>
  );
};
