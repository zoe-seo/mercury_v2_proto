import { useState } from 'react';
import { Button } from '../../common/Button';
import { Input } from '../../common/Input';
import type { CreatePackageRequest } from '../../../types/designPackage';

interface PackageInputStepProps {
  initialImage: string; // URL of the selected image from canvas
  onSubmit: (data: CreatePackageRequest) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const PackageInputStep = ({
  initialImage,
  onSubmit,
  onCancel,
  isSubmitting
}: PackageInputStepProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    brandName: '',
    keywords: '', // Changed to keywords to match legacy
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title: formData.title,
      description: formData.description,
      metadata: {
        brand_info: {
          brand_name: formData.brandName,
          target_audience: '', // Optional in legacy
          price_range: '' // Optional in legacy
        }
      }
    });
  };

  return (
    <div className="flex flex-col h-full">
       <div className="flex-1 overflow-y-auto p-6">
         <div className="grid grid-cols-12 gap-8">
            {/* Left: Reference Image */}
            <div className="col-span-4 space-y-3">
              <label className="text-sm font-medium text-gray-700 block">Reference Image</label>
              <div className="aspect-square bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden relative group">
                  {initialImage ? (
                      <img src={initialImage} alt="Reference" className="w-full h-full object-contain p-2" />
                  ) : (
                      <div className="text-center text-gray-400 p-4">
                        <p className="text-xs">No image selected</p>
                      </div>
                  )}
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                  This image will be used as the base reference for generating technical 2D views and the final 3D model.
              </p>
            </div>

            {/* Right: Form */}
            <div className="col-span-8 space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Package Details</h3>
                  <p className="text-sm text-gray-500">Define the metadata for your design package.</p>
                </div>

                <div className="space-y-4">
                    <Input 
                        label="Title *" 
                        placeholder="e.g., Urban Runner Black & White" 
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        autoFocus
                    />

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Description *</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            placeholder="Describe the design concept, materials, and inspiration..."
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-sm"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input 
                            label="Brand Name" 
                            placeholder="e.g., UrbanFit" 
                            value={formData.brandName}
                            onChange={(e) => setFormData({...formData, brandName: e.target.value})}
                        />
                        <Input 
                            label="Keywords" 
                            placeholder="modern, sleek, urban" 
                            value={formData.keywords}
                            onChange={(e) => setFormData({...formData, keywords: e.target.value})}
                        />
                    </div>
                </div>
            </div>
         </div>
       </div>

       {/* Footer */}
       <div className="p-6 border-t border-gray-100 bg-white flex justify-end gap-3">
          <Button variant="ghost" onClick={onCancel} disabled={isSubmitting}>
              Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit} 
            disabled={!formData.title || !formData.description || isSubmitting}
            className="px-8"
          >
              {isSubmitting ? 'Starting Production...' : 'Start Production →'}
          </Button>
       </div>
    </div>
  );
};
