import React from 'react';
import type { DesignItem } from '../../types/api/projects';
import { MessageSquare, Palette, MoreHorizontal } from 'lucide-react';


interface DesignCardProps {
  item: DesignItem;
  onClick?: () => void;
  onMenuClick?: (e: React.MouseEvent) => void;
}

export const DesignCard: React.FC<DesignCardProps> = ({ item, onClick, onMenuClick }) => {
  const isCanvas = item.type === 'canvas';

  return (
    <div 
      className="group flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-[2px] transition-all cursor-pointer h-full"
      onClick={onClick}
    >
      {/* Thumbnail Area */}
      <div className="relative aspect-video bg-gray-100 overflow-hidden">
        {item.thumbnail_url ? (
          <img 
            src={item.thumbnail_url} 
            alt={item.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            {isCanvas ? <Palette size={48} /> : <MessageSquare size={48} />}
          </div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <button className="bg-white/90 text-gray-900 px-4 py-2 rounded-full text-sm font-medium shadow-sm hover:bg-white inset-ring inset-ring-gray-200">
            Open
          </button>
        </div>

        {/* Type Badge */}
        <div className={`absolute top-3 left-3 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm 
          ${isCanvas ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-blue-50 text-blue-700 border border-blue-100'}`}>
          {isCanvas ? <Palette size={12} /> : <MessageSquare size={12} />}
          {item.type}
        </div>
      </div>

      {/* Info Area */}
      <div className="p-4 flex flex-col flex-grow relative">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold text-gray-900 line-clamp-1 pr-6" title={item.title}>
            {item.title}
          </h3>
          <button 
            className="absolute top-4 right-2 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              onMenuClick?.(e);
            }}
          >
            <MoreHorizontal size={20} />
          </button>
        </div>

        <p className="text-sm text-gray-500 line-clamp-2 mb-3 min-h-[2.5em]">
          {item.description || "No description provided."}
        </p>

        <div className="mt-auto flex items-center justify-between text-xs text-gray-400">
          <span>{new Date(item.updated_at).toLocaleDateString()}</span>
          
          {item.project_name && (
            <span 
              className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded hover:bg-gray-200 cursor-pointer transition-colors max-w-[120px] truncate"
              onClick={(e) => {
                e.stopPropagation();
                // Navigate to project
              }}
            >
              📁 {item.project_name}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
