import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Bell, User, Settings, Sun } from 'lucide-react';
import { Button } from '../common/Button';
import { cn } from '../../utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Project', path: '/projects' },
    { label: 'Development', path: '/development' },
    // { label: 'Marketing', path: '/marketing' }, // Future
    // { label: 'Support', path: '/support' }, // Future
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-4 h-full flex items-center justify-between">
        
        {/* Left: Logo */}
        <div className="flex items-center w-[20%]">
          <Link to="/" className="text-2xl font-heading font-bold text-[#14AE5C] flex items-center gap-2">
            <span>Mercury</span>
          </Link>
        </div>

        {/* Center: Top Nav (Desktop) */}
        <nav className="hidden md:flex items-center justify-center w-[60%] gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-md transition-colors relative",
                isActive(item.path) 
                  ? "text-primary-700 bg-primary-50" 
                  : "text-gray-600 hover:text-primary-600 hover:bg-gray-50"
              )}
            >
              {item.label}
              {isActive(item.path) && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 mx-4"
                  initial={false}
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Right: User Menu */}
        <div className="flex items-center justify-end w-[20%] gap-2">
          <Button variant="icon" size="icon" aria-label="Theme">
            <Sun size={20} />
          </Button>
          <Button variant="icon" size="icon" aria-label="Notifications" className="relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-coral-500 rounded-full border-2 border-white" />
          </Button>
          
          <div className="hidden sm:flex items-center gap-3 ml-2 pl-2 border-l border-gray-200">
             <Link to="/mypage" className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold border border-primary-200 hover:ring-2 hover:ring-primary-200 transition-all">
               J
             </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <Button 
            variant="icon" 
            size="icon" 
            className="md:hidden ml-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-200 overflow-hidden"
          >
            <nav className="flex flex-col p-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "px-4 py-3 text-base font-medium rounded-lg",
                    isActive(item.path)
                      ? "bg-primary-50 text-primary-700"
                      : "text-gray-600 hover:bg-gray-50"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="h-px bg-gray-100 my-2" />
              <Link to="/mypage" className="px-4 py-3 text-base font-medium text-gray-600 flex items-center gap-2">
                <User size={18} /> Profile
              </Link>
              <Link to="/settings" className="px-4 py-3 text-base font-medium text-gray-600 flex items-center gap-2">
                <Settings size={18} /> Settings
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
