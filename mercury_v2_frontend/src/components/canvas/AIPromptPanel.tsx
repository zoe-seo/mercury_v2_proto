import { motion } from 'framer-motion';
import {
  Wand2,
  X,
  Sparkles,
  Paintbrush,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { Button } from '../common/Button';
import { useState, useEffect } from 'react';
import { useGenerateImage, useInpaintImage, useTaskStatus } from '../../queries/useCanvas';
import { useCanvasStore } from '../../store/canvasStore';

interface AIPromptPanelProps {
  canvasId: string | undefined;
  position?: { x: number; y: number };
  onClose?: () => void;
  isOpen?: boolean;
  onCreatePackage?: () => void;
}

export const AIPromptPanel = ({
  canvasId,
  position,
  onClose,
  isOpen = true,
  onCreatePackage,
}: AIPromptPanelProps) => {
  const [prompt, setPrompt] = useState('');
  const [taskId, setTaskId] = useState<string | null>(null);

  const { inpaintMode, setInpaintMode, selectedObjectId, layers } =
    useCanvasStore();

  const { mutate: generateImage, isPending: isGenerating } = useGenerateImage();
  const { mutate: inpaintImage, isPending: isInpainting } = useInpaintImage();

  // Poll task status
  const { data: taskStatus } = useTaskStatus(taskId, !!taskId);

  // Handle task completion
  useEffect(() => {
    if (taskStatus?.status === 'SUCCESS') {
      console.log('Generation complete:', taskStatus.result);
      setTaskId(null);
      setPrompt('');
      // TODO: Add generated image to canvas
    } else if (taskStatus?.status === 'FAILURE') {
      console.error('Generation failed:', taskStatus.error);
      setTaskId(null);
    }
  }, [taskStatus]);

  const handleGenerate = () => {
    if (!canvasId || !prompt) return;

    if (inpaintMode && selectedObjectId) {
      // Inpainting mode
      inpaintImage(
        {
          canvasId,
          data: {
            layer_id: selectedObjectId,
            mask_data: { paths: [] }, // TODO: Get actual mask data from canvas
            prompt,
            generation_params: {
              strength: 0.8,
            },
          },
        },
        {
          onSuccess: (response) => {
            setTaskId(response.task_id);
          },
        }
      );
    } else {
      // Normal generation
      const visibleLayers = layers
        .filter((l) => l.is_visible)
        .map((l) => l.id);

      generateImage(
        {
          canvasId,
          data: {
            layer_ids: visibleLayers,
            prompt,
            generation_params: {
              strength: 0.7,
              steps: 50,
              guidance_scale: 7.5,
            },
          },
        },
        {
          onSuccess: (response) => {
            setTaskId(response.task_id);
          },
        }
      );
    }
  };

  if (!isOpen) return null;

  const isProcessing = isGenerating || isInpainting || !!taskId;

  return (
    <motion.div
      initial={{ y: 10, opacity: 0, scale: 0.95 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      style={{
        top: position ? position.y : '50%',
        left: position ? position.x : '50%',
        transform: position ? 'translate(-50%, 0)' : 'translate(-50%, -50%)',
      }}
      className="absolute bg-white rounded-xl shadow-2xl border border-primary-100 p-3 z-50 flex flex-col gap-3 w-[360px] pointer-events-auto"
    >
      {/* Header / Input Area */}
      <div className="flex gap-3">
        <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-indigo-500 rounded-lg flex items-center justify-center text-white shadow-sm shrink-0">
          <Wand2 size={18} />
        </div>

        <div className="flex-1 relative">
          <textarea
            placeholder={
              inpaintMode
                ? 'Describe what to fill in...'
                : 'Describe what to generate...'
            }
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full text-sm border-none focus:ring-0 placeholder-gray-400 p-0 resize-none h-14 bg-transparent"
            disabled={isProcessing}
          />
          <button
            className="absolute bottom-0 right-0 p-1 text-indigo-500 hover:text-indigo-600 transition-colors"
            title="Enhance Prompt"
          >
            <Sparkles size={14} />
          </button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-gray-400 -mt-1 -mr-1"
          onClick={onClose}
        >
          <X size={14} />
        </Button>
      </div>

      {/* Progress */}
      {taskStatus?.status === 'PROGRESS' && (
        <div className="bg-primary-50 rounded-lg p-2 text-xs text-primary-700">
          <div className="flex items-center gap-2">
            <Loader2 size={14} className="animate-spin" />
            <span>{taskStatus.progress?.status || 'Processing...'}</span>
          </div>
          {taskStatus.progress && (
            <div className="mt-1 bg-white rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-primary-500 h-full transition-all"
                style={{
                  width: `${(taskStatus.progress.current / taskStatus.progress.total) * 100}%`,
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-2">
        <div className="flex gap-1">
          <button
            onClick={() => setInpaintMode(!inpaintMode)}
            className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${inpaintMode ? 'bg-primary-50 text-primary-600' : 'text-gray-500 hover:bg-gray-50'}`}
            disabled={isProcessing}
          >
            <Paintbrush size={14} />
            Inpaint
          </button>
          <button
            className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:bg-gray-50 transition-colors"
            disabled={isProcessing}
          >
            <RefreshCw size={14} />
            Variations
          </button>
        </div>

        <Button
          size="sm"
          className="h-8 px-4 text-xs font-medium bg-primary-600 hover:bg-primary-700 text-white shadow-sm"
          onClick={handleGenerate}
          disabled={!prompt || isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 size={12} className="animate-spin mr-1.5" />
              Generating
            </>
          ) : (
            'Generate'
          )}
        </Button>
      </div>

      {/* Create Package Button */}
      <div className="border-t border-gray-100 pt-2">
        <Button
          size="sm"
          variant="ghost"
          className="w-full h-8 text-xs font-medium text-primary-600 hover:bg-primary-50 gap-1.5"
          onClick={() => {
            onCreatePackage?.();
          }}
        >
          <Sparkles size={14} />
          Create Design Package
        </Button>
      </div>

      {inpaintMode && (
        <div className="bg-primary-50/50 rounded-lg p-2 text-xs text-primary-700 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
          Draw on canvas to mask area
        </div>
      )}
    </motion.div>
  );
};
