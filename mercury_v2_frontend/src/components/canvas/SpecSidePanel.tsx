import { motion } from 'framer-motion';
import { DesignBriefForm } from '../common/DesignBrief/DesignBriefForm';
import { useCanvasBrief, useUpsertCanvasBrief } from '../../queries/useDesignBrief';
import type { DesignBriefUpdate } from '../../types/api/designBrief';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

interface SpecSidePanelProps {
  canvasId?: string;
  isOpen: boolean;
  className?: string;
}

export const SpecSidePanel = ({ canvasId, isOpen, className }: SpecSidePanelProps) => {
  const { data: briefData, isLoading } = useCanvasBrief(canvasId);
  const { mutate: upsertBrief, isPending: isSaving } = useUpsertCanvasBrief(canvasId);

  const handleSave = (data: DesignBriefUpdate) => {
    upsertBrief(data);
  };

  return (
    <motion.div
      initial={{ x: -320, opacity: 0 }}
      animate={{ x: isOpen ? 0 : -320, opacity: isOpen ? 1 : 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className={cn(
        "absolute top-0 left-0 h-full w-[320px] bg-white border-r border-gray-200 shadow-xl z-20 flex flex-col",
        className
      )}
    >
      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
        <h2 className="font-semibold text-gray-800">Design Brief</h2>
        {isSaving && <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />}
      </div>

      <div className="flex-1 overflow-hidden p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="w-6 h-6 text-primary-500 animate-spin" />
          </div>
        ) : (
          <DesignBriefForm
            variant="sidebar"
            initialData={briefData}
            onSave={handleSave}
            className="h-full"
          />
        )}
      </div>
    </motion.div>
  );
};
