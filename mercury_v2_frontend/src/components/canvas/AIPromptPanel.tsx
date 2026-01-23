import { motion } from 'framer-motion';
import { Wand2, X } from 'lucide-react';
import { Button } from '../common/Button';

export const AIPromptPanel = () => {
  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="absolute top-[420px] left-[100px] bg-white rounded-lg shadow-2xl border border-primary-200 p-2 z-50 flex flex-col gap-2 w-[320px]"
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600">
            <Wand2 size={16} />
        </div>
        <input 
          type="text" 
          placeholder="Describe changes (e.g., make it red)"
          className="flex-1 text-sm border-none focus:ring-0 placeholder-gray-400 p-0"
        />
        <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400">
            <X size={14} />
        </Button>
      </div>
      
      <div className="flex gap-2">
        <Button size="sm" className="flex-1 py-1 h-8 text-xs">
           Generate
        </Button>
        <button className="text-xs text-gray-500 font-medium px-2 hover:bg-gray-100 rounded">
            Settings
        </button>
      </div>
    </motion.div>
  );
};
