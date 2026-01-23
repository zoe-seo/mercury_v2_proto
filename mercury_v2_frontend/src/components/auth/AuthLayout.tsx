import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo */}
        <Link to="/" className="flex justify-center items-center gap-2 mb-6 group">
            <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center text-white text-xl font-heading font-bold shadow-lg group-hover:bg-primary-600 transition-colors">
              M
            </div>
            <span className="text-2xl font-heading font-bold text-gray-900">Mercury</span>
        </Link>
        
        <h2 className="text-center text-3xl font-heading font-bold text-gray-900 tracking-tight">
          {title}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 max-w-sm mx-auto">
          {subtitle}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[448px]">
        <div className="bg-white py-10 px-8 shadow-xl rounded-2xl border border-gray-100/50">
          {children}
        </div>
      </div>
      
      {/* Footer / Copyright */}
      <div className="mt-8 text-center text-xs text-gray-400">
        &copy; 2026 Mercury Design. All rights reserved.
      </div>
    </div>
  );
};
