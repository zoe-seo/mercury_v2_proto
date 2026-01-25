import React from 'react';
import type { Project } from '../../types/api/projects';
import { Folder, MoreHorizontal } from 'lucide-react';

interface ProjectFolderCardProps {
  project: Project;
  onClick?: () => void;
  onMenuClick?: (e: React.MouseEvent) => void;
}

export const ProjectFolderCard: React.FC<ProjectFolderCardProps> = ({ project, onClick, onMenuClick }) => {
  return (
    <div 
      className="group flex flex-col bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-all cursor-pointer h-full relative"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="bg-blue-50 text-blue-500 p-3 rounded-xl">
          <Folder size={32} />
        </div>
        <button 
          className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            onMenuClick?.(e);
          }}
        >
          <MoreHorizontal size={20} />
        </button>
      </div>

      <div className="mt-auto">
        <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-1" title={project.name}>
          {project.name}
        </h3>
        <div className="flex items-center text-sm text-gray-500">
          <span className="bg-gray-100 px-2 py-0.5 rounded-full text-xs font-medium text-gray-600">
            {project.design_count} items
          </span>
          <span className="mx-2 text-gray-300">•</span>
          <span className="text-xs">Updated {new Date(project.updated_at).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};
