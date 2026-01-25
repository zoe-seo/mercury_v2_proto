import React from 'react';
import { Search, Plus } from 'lucide-react';

interface ProjectsToolbarProps {
  onSearch: (query: string) => void;
  onFilterChange?: (filter: string) => void;
  activeFilter?: string; // 'all' | 'canvas' | 'chat'
  showFilter?: boolean;
  onCreateClick: () => void;
  createButtonLabel?: string;
}

export const ProjectsToolbar: React.FC<ProjectsToolbarProps> = ({ 
  onSearch, 
  onFilterChange, 
  activeFilter = 'all', 
  showFilter = false,
  onCreateClick,
  createButtonLabel = 'New Object'
}) => {
  return (
    <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
      
      {/* Search */}
      <div className="relative w-full md:w-80">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search projects..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-shadow shadow-sm"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto">
        {/* Filter Segmented Control */}
        {showFilter && onFilterChange && (
          <div className="flex bg-gray-100 p-1 rounded-lg">
            {['all', 'canvas', 'chat'].map((filter) => (
              <button
                key={filter}
                onClick={() => onFilterChange(filter)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md capitalize transition-all ${
                  activeFilter === filter 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        )}

        {/* Sort (Simplified for prototype) */}
        <select className="border-gray-300 rounded-lg text-sm bg-white shadow-sm focus:ring-emerald-500 focus:border-emerald-500 py-2 pl-3 pr-8">
          <option>Last Modified</option>
          <option>Name (A-Z)</option>
          <option>Date Created</option>
        </select>

        {/* Create Button */}
        <button 
          onClick={onCreateClick}
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 shadow-sm transition-colors whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          {createButtonLabel}
        </button>
      </div>
    </div>
  );
};
