import { motion } from 'framer-motion';
import { Scan, Sparkles, Tag, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../common/Button';
import { useState } from 'react';
import { useSegmentation } from '../../queries/useCanvas';
import { useCanvasStore } from '../../store/canvasStore';

interface SegmentsPanelProps {
  canvasId: string | undefined;
  onSegmentClick: (id: string) => void;
}

export const SegmentsPanel = ({
  canvasId,
  onSegmentClick,
}: SegmentsPanelProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { segments, setSegments, selectedObjectId } = useCanvasStore();

  const { mutate: requestSegmentation, isPending: isAnalyzing } =
    useSegmentation();

  const handleAnalyze = () => {
    if (!canvasId || !selectedObjectId) {
      console.warn('No canvas or selected object');
      return;
    }

    requestSegmentation(
      {
        canvasId,
        layerId: selectedObjectId,
      },
      {
        onSuccess: (data) => {
          setSegments(data.segments);
        },
        onError: (error) => {
          console.error('Segmentation failed:', error);
        },
      }
    );
  };

  const isAnalyzed = segments.length > 0;

  return (
    <motion.div
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="absolute bottom-6 right-6 w-64 bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-gray-100 z-40 pointer-events-auto flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div
        className="flex items-center justify-between p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 bg-white"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <Scan size={16} className="text-primary-500" />
          <span>Segments</span>
        </div>
        {isCollapsed ? (
          <ChevronUp size={16} className="text-gray-400" />
        ) : (
          <ChevronDown size={16} className="text-gray-400" />
        )}
      </div>

      {/* Content */}
      {!isCollapsed && (
        <div className="p-3">
          {!isAnalyzed ? (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <p className="text-xs text-gray-500">
                {selectedObjectId
                  ? 'Analyze sketch to detect parts.'
                  : 'Select an image layer first.'}
              </p>
              <Button
                size="sm"
                className="w-full gap-2 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white shadow-md border-0"
                onClick={handleAnalyze}
                disabled={!selectedObjectId || isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={14} />
                    <span>Analyze Sketch</span>
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-gray-500">
                  {segments.length} parts detected
                </span>
                <button
                  className="text-xs text-primary-600 hover:underline"
                  onClick={() => setSegments([])}
                >
                  Reset
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {segments.map((seg) => (
                  <button
                    key={seg.id}
                    onClick={() => onSegmentClick(seg.id)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-primary-50 hover:text-primary-700 hover:ring-1 hover:ring-primary-200 transition-all"
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
  );
};
