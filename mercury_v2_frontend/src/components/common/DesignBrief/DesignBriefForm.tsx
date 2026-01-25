import React, { useState, useEffect } from 'react';
import { Check, Image as ImageIcon } from 'lucide-react';
import type { DesignBrief, DesignBriefUpdate } from '../../../types/api/designBrief';
import { ReferenceGallery } from '../../chat/ReferenceGallery';
import { cn } from '../../../utils/cn';

interface DesignBriefFormProps {
  initialData?: DesignBrief;
  readOnly?: boolean;
  onSave?: (data: DesignBriefUpdate) => void;
  className?: string;
  variant?: 'default' | 'sidebar';
}

export const DesignBriefForm: React.FC<DesignBriefFormProps> = ({
  initialData,
  readOnly = false,
  onSave,
  className = '',
  variant = 'default',
}) => {
  const [formData, setFormData] = useState<DesignBriefUpdate>({});
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  
  // Advanced Toggle (Marketing Info) - Hidden based on spec "Clean Layout"
  // For now we keep it always hidden or maybe we will add a toggle later if requested.
  // The user asked to "Hide Marketing by default".

  useEffect(() => {
    if (initialData) {
      setFormData({
        concept_info: initialData.concept_info,
        shoe_spec: initialData.shoe_spec,
        marketing_context: initialData.marketing_context,
        reference_image_url: initialData.reference_image_url,
      });
    }
  }, [initialData]);

  const handleInputChange = (
    section: keyof DesignBriefUpdate,
    field: string,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...((prev[section] as any) || {}),
        [field]: value,
      },
    }));
  };

  const handleArrayChange = (
      section: keyof DesignBriefUpdate,
      field: string,
      value: string
  ) => {
    const arrayValue = value.split(',').map((s: string) => s.trim()).filter((s: string) => s !== '');
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...((prev[section] as any) || {}),
        [field]: arrayValue,
      },
    }));
  };
  
  const getArrayString = (arr?: string[]) => {
      return arr ? arr.join(', ') : '';
  }

  const handleSubmit = () => {
    if (onSave) {
      onSave(formData);
    }
  };

  // Predefined Options
  const TONES = ['Minimalist', 'Futuristic', 'Retro', 'Industrial', 'Organic', 'Aggressive', 'Elegant', 'Playful', 'Techwear', 'Luxury'];
  const MATERIALS = ['Engineered Mesh', 'Primeknit', 'Full Grain Leather', 'Suede', 'Nubuck', 'Synthetic', 'TPU Cage', 'Gore-Tex', 'Canvas', 'Knit'];
  const SOLES = ['Chunky Vibram', 'EVA Foam', 'Air Cushion', 'Carbon Plate', 'Low Profile Rubber', 'Cleated', 'Boost-like', 'Waffle', 'Cupsole'];
  const CATEGORIES = ['Running', 'Lifestyle', 'Basketball', 'Outdoor', 'Training', 'Skate', 'Hiking', 'Fashion'];

  const toggleTone = (tone: string) => {
      const currentTones = formData.concept_info?.overall_tone ? formData.concept_info.overall_tone.split(', ') : [];
      let newTones;
      if (currentTones.includes(tone)) {
          newTones = currentTones.filter(t => t !== tone);
      } else {
          newTones = [...currentTones, tone];
      }
      handleInputChange('concept_info', 'overall_tone', newTones.join(', '));
  };

  return (
    <div className={cn("flex flex-col h-full bg-white", className)}>
      
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto">
        
        {/* 1. Header & Template Import */}
        <div className="bg-gray-50 border-b border-gray-100 p-4 cursor-pointer hover:bg-gray-100 relative overflow-hidden">
            <div className="relative z-10">
                {/* Template / Gallery Entry */}
                {!readOnly && (
                    <button 
                        onClick={() => setIsGalleryOpen(true)}
                        className="group flex cursor-pointer items-center gap-4 rounded-xl transition-all w-full text-left"
                    >
                        <div className="w-12 h-12 bg-white text-gray-400 rounded-lg flex items-center justify-center group-hover:text-primary-500 transition-colors">
                            <ImageIcon size={24} />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-gray-800 group-hover:text-primary-600 transition-colors text-lg">Import Style Template</h4>
                            <p className="text-sm text-gray-500">Start by choosing a visual style foundation from the gallery</p>
                        </div>
                        {formData.reference_image_url && (
                             <div className="px-3 py-1 bg-white text-green-700 text-xs font-bold rounded-full border border-green-100 flex items-center gap-1">
                                <Check size={12} />
                                Selected
                             </div>
                        )}
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-400 group-hover:text-primary-500">
                             <span className="text-xl leading-none group-hover:translate-x-0.5 transition-transform">→</span>
                        </div>
                    </button>
                )}
            </div>
        </div>

        <div className="p-8 space-y-10">
            {/* 2. Strategy & Concept (Chips & Selects) */}
            <section className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                     <span className="w-1.5 h-1.5 rounded-full bg-gray-900"></span>
                     <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Strategy & Mood</h3>
                </div>

                <div className={cn("grid gap-8", variant === 'sidebar' ? 'grid-cols-1' : 'grid-cols-2')}>
                     {/* Info Grid */}
                     <div className="space-y-5">
                         <div>
                            <label className="text-xs font-semibold text-gray-500 block mb-2">Category</label>
                            <select
                                value={formData.shoe_spec?.category || ''}
                                disabled={readOnly}
                                onChange={(e) => handleInputChange('shoe_spec', 'category', e.target.value)}
                                className="w-full h-11 px-3 text-sm border border-gray-200 rounded-xl focus:border-gray-900 focus:ring-0 bg-white hover:border-gray-300 transition-colors cursor-pointer"
                            >
                                <option value="">Select Category...</option>
                                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                         </div>

                         <div className="flex gap-4">
                             <div className="flex-1">
                                <label className="text-xs font-semibold text-gray-500 block mb-2">Gender</label>
                                <select
                                    value={formData.concept_info?.target_audience?.gender || ''}
                                    disabled={readOnly}
                                    onChange={(e) => handleInputChange('concept_info', 'target_audience', {...formData.concept_info?.target_audience, gender: e.target.value})}
                                    className="w-full h-11 px-3 text-sm border border-gray-200 rounded-xl focus:border-gray-900 focus:ring-0 bg-white hover:border-gray-300 transition-colors cursor-pointer"
                                >
                                    <option value="">Any</option>
                                    <option value="men">Men</option>
                                    <option value="women">Women</option>
                                    <option value="unisex">Unisex</option>
                                </select>
                             </div>
                             <div className="w-32">
                                <label className="text-xs font-semibold text-gray-500 block mb-2">Age Group</label>
                                <select
                                    value={formData.concept_info?.target_audience?.age_group || ''}
                                    disabled={readOnly}
                                    onChange={(e) => handleInputChange('concept_info', 'target_audience', {...formData.concept_info?.target_audience, age_group: e.target.value})}
                                    className="w-full h-11 px-3 text-sm border border-gray-200 rounded-xl focus:border-gray-900 focus:ring-0 bg-white hover:border-gray-300 transition-colors cursor-pointer"
                                >
                                    <option value="">Any</option>
                                    <option value="10s">10s</option>
                                    <option value="20s">20s</option>
                                    <option value="30s">30s</option>
                                    <option value="40s">40s</option>
                                    <option value="50s+">50s+</option>
                                </select>
                             </div>
                         </div>
                     </div>
                    
                    {/* Tone Chips */}
                     <div>
                        <label className="text-xs font-semibold text-gray-500 block mb-3">Tone & Mood (Multi-select)</label>
                        <div className="flex flex-wrap gap-2">
                            {TONES.map(tone => {
                                const isSelected = formData.concept_info?.overall_tone?.includes(tone);
                                return (
                                    <button
                                        key={tone}
                                        disabled={readOnly}
                                        onClick={() => toggleTone(tone)}
                                        className={cn(
                                            "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all active:scale-95",
                                            isSelected 
                                                ? "bg-gray-900 text-white border-gray-900 shadow-sm" 
                                                : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                        )}
                                    >
                                        {tone}
                                    </button>
                                );
                            })}
                        </div>
                     </div>
                </div>
            </section>

            <div className="h-px bg-gray-100" />

            {/* 3. Tech Specs (Selects) */}
            <section className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                     <span className="w-1.5 h-1.5 rounded-full bg-gray-900"></span>
                     <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Technical Specs</h3>
                </div>

                <div className={cn("grid gap-8", variant === 'sidebar' ? 'grid-cols-1' : 'grid-cols-2')}>
                     <div>
                        <label className="text-xs font-semibold text-gray-500 block mb-2">Upper Material</label>
                        <select
                            value={formData.shoe_spec?.upper_material || ''}
                            disabled={readOnly}
                            onChange={(e) => handleInputChange('shoe_spec', 'upper_material', e.target.value)}
                            className="w-full h-11 px-3 text-sm border border-gray-200 rounded-xl focus:border-gray-900 focus:ring-0 bg-white hover:border-gray-300 transition-colors cursor-pointer"
                        >
                            <option value="">Select Material...</option>
                            {MATERIALS.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                     </div>
                     
                     <div>
                        <label className="text-xs font-semibold text-gray-500 block mb-2">Sole Technology</label>
                         <select
                            value={formData.shoe_spec?.sole_type || ''}
                            disabled={readOnly}
                            onChange={(e) => handleInputChange('shoe_spec', 'sole_type', e.target.value)}
                            className="w-full h-11 px-3 text-sm border border-gray-200 rounded-xl focus:border-gray-900 focus:ring-0 bg-white hover:border-gray-300 transition-colors cursor-pointer"
                        >
                            <option value="">Select Sole Tech...</option>
                            {SOLES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                     </div>
                </div>

                {/* Color Palette */}
                 <div className="pt-2">
                    <div className="flex justify-between items-end mb-3">
                        <label className="text-xs font-semibold text-gray-500 block">Color Palette</label>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="flex items-center -space-x-2">
                             {formData.shoe_spec?.key_colors?.map((color, idx) => (
                                <div key={idx} className="w-10 h-10 rounded-full border-2 border-white shadow-md ring-1 ring-gray-100" style={{ backgroundColor: color.trim() }} title={color} />
                            ))}
                             {(!formData.shoe_spec?.key_colors || formData.shoe_spec.key_colors.length === 0) && (
                               <div className="w-10 h-10 rounded-full border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center text-gray-300 text-[10px] font-medium">None</div>
                            )}
                        </div>
                        
                        {!readOnly && (
                             <input
                                type="text"
                                value={getArrayString(formData.shoe_spec?.key_colors)}
                                onChange={(e) => handleArrayChange('shoe_spec', 'key_colors', e.target.value)}
                                className="flex-1 h-10 px-4 text-xs border border-gray-200 rounded-xl focus:border-gray-900 focus:ring-0 bg-white transition-colors text-gray-600 font-mono shadow-sm"
                                placeholder="e.g. #FFFFFF, #FF0000 (Enter Hex Codes)"
                            />
                        )}
                    </div>
                 </div>
            </section>
        </div>

      </div>

      {/* Reference Gallery Overlay - Full Cover */}
      {isGalleryOpen && !readOnly && (
         <ReferenceGallery 
            onClose={() => setIsGalleryOpen(false)}
            onSelect={(item) => {
                // Merge brief data from reference
                setFormData(prev => ({
                    ...prev,
                    concept_info: { ...prev.concept_info, ...item.brief_data.concept_info },
                    shoe_spec: { ...prev.shoe_spec, ...item.brief_data.shoe_spec },
                    marketing_context: { ...prev.marketing_context, ...item.brief_data.marketing_context },
                    reference_image_url: item.image_url
                }));
                setIsGalleryOpen(false);
            }}
         />
      )}

      {/* Footer Action */}
      {!readOnly && onSave && (
        <div className="p-4 border-t border-gray-100 bg-white flex justify-end gap-3 items-center">
            <span className="text-xs text-gray-400 font-medium mr-auto pl-2">Last saved: Just now</span>
            <button 
                onClick={() => setFormData(initialData || {})}
                className="px-4 py-2.5 text-gray-500 text-sm font-semibold hover:bg-gray-50 rounded-xl transition-colors"
            >
                Reset
            </button>
            <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-8 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-black transition-all shadow-lg hover:shadow-xl text-sm font-bold active:scale-95"
            >
                <Check size={16} />
                Confirm Brief
            </button>
        </div>
      )}
    </div>
  );
};
