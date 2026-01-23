import { cn } from '../../utils/cn';

interface CanvasLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const CanvasLayout = ({ children, className }: CanvasLayoutProps) => {
  return (
    <div className={cn("relative w-full h-[calc(100vh-64px)] overflow-hidden bg-gray-50", className)}>
      {children}
    </div>
  );
};
