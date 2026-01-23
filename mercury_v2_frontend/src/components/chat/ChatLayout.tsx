import { useState } from 'react';
import { cn } from '../../utils/cn';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Button } from '../common/Button';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  className?: string;
}

export const ChatLayout = ({ children, sidebar, className }: ChatLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className={cn("flex h-[calc(100vh-64px)] overflow-hidden bg-white relative", className)}>
      
      {/* Sidebar (Session List) */}
      <AnimatePresence initial={false} mode="wait">
        {isSidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="border-r border-gray-200 bg-gray-50 flex-shrink-0 flex flex-col hidden md:flex overflow-hidden whitespace-nowrap"
          >
            <div className="w-[320px] h-full flex flex-col">
              {sidebar}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content (Chat Area) */}
      <main className="flex-1 flex flex-col relative w-full h-full min-w-0">
        {/* Toggle Button (Absolute positioned) */}
        <div className="absolute top-4 left-4 z-10">
           <Button 
             variant="ghost" 
             size="icon" 
             onClick={() => setIsSidebarOpen(!isSidebarOpen)}
             className="bg-white/50 backdrop-blur-sm hover:bg-white border border-transparent hover:border-gray-200 shadow-sm transition-all"
             title={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
           >
             {isSidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
           </Button>
        </div>
        {children}
      </main>
    </div>
  );
};
