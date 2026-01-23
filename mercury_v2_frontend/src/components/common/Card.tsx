import { motion, type HTMLMotionProps } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { forwardRef } from 'react';

// Utility for merging tailwind classes (duplicated in Button, could be moved to utils)
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface CardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  noHover?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, noHover = false, onClick, ...props }, ref) => {
    
    const isInteractive = !!onClick && !noHover;

    return (
      <motion.div
        ref={ref}
        onClick={onClick}
        className={cn(
          "p-6 bg-white border border-gray-200 rounded-xl shadow transition-colors",
          isInteractive && "cursor-pointer hover:shadow-lg", 
          className
        )}
        whileHover={isInteractive ? { y: -4 } : undefined}
        transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = "Card";
