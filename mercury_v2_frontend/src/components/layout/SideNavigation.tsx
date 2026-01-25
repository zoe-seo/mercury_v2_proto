import React from 'react';
import { NavLink } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface NavItem {
  name: string;
  path: string;
  icon: LucideIcon;
  end?: boolean;
}

interface SideNavigationProps {
  title?: string;
  items: NavItem[];
  className?: string;
}

export const SideNavigation: React.FC<SideNavigationProps> = ({ title, items, className }) => {
  return (
    <aside className={cn("w-64 bg-gray-50/50 border-r border-gray-200 flex-shrink-0 flex flex-col py-6", className)}>
      {title && (
        <div className="px-4 mb-6">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            {title}
          </h2>
        </div>
      )}
      
      <nav className="flex-1 px-3 space-y-1">
        {items.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.end}
            className={({ isActive }) => cn(
              "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors group",
              isActive 
                ? "bg-emerald-50 text-emerald-700 border-l-4 border-emerald-500" 
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 border-l-4 border-transparent"
            )}
          >
            <item.icon
              className={cn(
                "flex-shrink-0 -ml-1 mr-3 h-5 w-5",
                "text-gray-400 group-hover:text-gray-500"
              )}
            />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
