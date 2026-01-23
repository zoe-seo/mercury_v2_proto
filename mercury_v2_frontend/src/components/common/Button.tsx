import { motion, type HTMLMotionProps } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { forwardRef } from 'react';

// Utility for merging tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
  children: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, ...props }, ref) => {
    
    const variants = {
      primary: "bg-[#14AE5C] text-white hover:bg-[#119A51] hover:shadow-primary disabled:opacity-50",
      secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 disabled:bg-gray-50",
      ghost: "bg-transparent text-primary-600 hover:bg-primary-50 disabled:bg-transparent disabled:text-gray-400",
      icon: "bg-transparent hover:bg-gray-100 active:bg-gray-200 text-gray-600 p-2 rounded-md aspect-square flex items-center justify-center",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-6 py-3 text-base font-medium",
      lg: "px-8 py-4 text-lg font-semibold",
      icon: "h-10 w-10 p-2",
    };

    const baseStyles = "rounded-lg transition-all focus:outline-none disabled:cursor-not-allowed flex items-center justify-center gap-2";

    // Animations
    const hoverAnimation = variant !== 'icon' ? { scale: 1.02, y: -2 } : { scale: 1.05 };
    const tapAnimation = { scale: 0.98 };

    return (
      <motion.button
        ref={ref}
        className={cn(baseStyles, variants[variant], variant !== 'icon' && sizes[size], className)}
        whileHover={!props.disabled && !loading ? hoverAnimation : undefined}
        whileTap={!props.disabled && !loading ? tapAnimation : undefined}
        transition={{ duration: 0.2 }}
        disabled={loading}
        {...props}
      >
        {loading ? (
           <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
           </svg>
        ) : null}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
