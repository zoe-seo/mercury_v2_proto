import { Header } from './Header';
import { cn } from '../../utils/cn';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const Layout = ({ children, className }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-700">
      <Header />
      
      {/* 
        Main content area. 
        Using framer-motion here for page transitions if supported by Router structure,
        but simple div is fine for layout wrapper. 
      */}
      <main className={cn("flex-1 w-full", className)}>
        {children}
      </main>
      
      {/* Optional Footer can be added here */}
    </div>
  );
};
