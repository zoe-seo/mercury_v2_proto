import React, { useState } from 'react';
import { X, Search } from 'lucide-react';
import type { ReferenceItem } from '../../types/api/gallery';
import { useReferenceGallery } from '@/queries/useDesignBrief';

interface ReferenceGalleryProps {
  onSelect: (item: ReferenceItem) => void;
  onClose: () => void;
}

export const ReferenceGallery: React.FC<ReferenceGalleryProps> = ({ onSelect, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data, isLoading } = useReferenceGallery();

  const items = data?.items || [];

  const filteredItems = items.filter((item: ReferenceItem) => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden absolute inset-0 z-50">
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white">
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Select Reference</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X size={18} />
        </button>
      </div>

      {/* Search */}
      <div className="p-3 bg-gray-50 border-b border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <input 
            type="text" 
            placeholder="Search styles..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
            <div className="text-center text-gray-400 text-xs mt-10">Loading references...</div>
        ) : (
            <div className="grid grid-cols-2 gap-3">
            {filteredItems.map((item: ReferenceItem) => (
            <div 
              key={item.id}
              onClick={() => onSelect(item)}
              className="group cursor-pointer aspect-square rounded-lg relative overflow-hidden border border-gray-200 hover:border-primary-500 transition-all"
            >
              <img src={item.image_url} alt={item.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
                <span className="text-white text-xs font-bold">{item.title}</span>
              </div>
            </div>
          ))}
            </div>
        )}
      </div>
      
    </div>
  );
};
