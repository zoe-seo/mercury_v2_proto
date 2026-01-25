import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  shortcut?: string;
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  delay?: number;
}

export const Tooltip = ({
  children,
  content,
  shortcut,
  side = 'bottom',
  align = 'center',
  delay = 300
}: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        let x = 0;
        let y = 0;
        const gap = 8;

        // Simple positioning logic (extensible)
        switch (side) {
          case 'bottom':
            x = rect.left + rect.width / 2;
            y = rect.bottom + gap;
            break;
          case 'top':
            x = rect.left + rect.width / 2;
            y = rect.top - gap;
            break;
          case 'right':
            x = rect.right + gap;
            y = rect.top + rect.height / 2;
            break;
          case 'left':
            x = rect.left - gap;
            y = rect.top + rect.height / 2;
            break;
        }
        
        setCoords({ x, y });
        setIsVisible(true);
      }
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }
  }, []);

  return (
    <>
      <div 
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="inline-flex"
      >
        {children}
      </div>
      
      {createPortal(
        <AnimatePresence>
          {isVisible && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: side === 'bottom' ? -5 : 5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.15 }}
              style={{
                position: 'fixed',
                left: coords.x,
                top: coords.y,
                transform: 'translate(-50%, -50%)', // Center based on coords
                // Adjust transform origin/translation based on side if needed for perfectly specific alignment
                // But for 'center' align, translate(-50%) on relevant axis works.
                // Currently simplified to center-x top-y for bottom side
                zIndex: 9999,
                translateX: '-50%',
                translateY: side === 'top' ? '-100%' : side === 'bottom' ? '0' : '-50%',
              }}
              className="px-2 py-1 text-xs bg-gray-900 text-white rounded shadow-md flex items-center gap-2 whitespace-nowrap pointer-events-none"
            >
              <span>{content}</span>
              {shortcut && (
                <span className="text-gray-400 bg-gray-800 rounded px-1 min-w-[16px] text-center font-mono">
                  {shortcut}
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};
