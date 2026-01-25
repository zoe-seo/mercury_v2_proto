import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Check, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '../common/Button';
import { useState } from 'react';

interface DesignPackagingWorkshopProps {
  isOpen: boolean;
  onClose: () => void;
  canvasId: string;
  selectedImageId?: string;
}

type WorkshopStep = 'metadata' | 'production' | 'finalize';

interface ProductionStatus {
  front?: 'pending' | 'processing' | 'completed' | 'failed';
  back?: 'pending' | 'processing' | 'completed' | 'failed';
  left?: 'pending' | 'processing' | 'completed' | 'failed';
  right?: 'pending' | 'processing' | 'completed' | 'failed';
  top?: 'pending' | 'processing' | 'completed' | 'failed';
  bottom?: 'pending' | 'processing' | 'completed' | 'failed';
  lifestyle?: 'pending' | 'processing' | 'completed' | 'failed';
  model3d?: 'pending' | 'processing' | 'completed' | 'failed';
}

export const DesignPackagingWorkshop = ({ 
  isOpen, 
  onClose, 
  canvasId,
  selectedImageId 
}: DesignPackagingWorkshopProps) => {
  const [currentStep, setCurrentStep] = useState<WorkshopStep>('metadata');
  const [packageId, setPackageId] = useState<string | null>(null);
  
  // Step 1: Metadata
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [brandName, setBrandName] = useState('');
  const [keywords, setKeywords] = useState('');
  
  // Step 2: Production Status
  const [productionStatus, setProductionStatus] = useState<ProductionStatus>({});
  const [isProducing, setIsProducing] = useState(false);
  
  // Step 3: Finalize
  const [isFinalizing, setIsFinalizing] = useState(false);

  const handleCreatePackage = async () => {
    // Mock API call - will use canvasId and packageId in real implementation
    console.log('Creating package with:', { title, description, brandName, keywords, canvasId });
    
    // Simulate API response
    setTimeout(() => {
      const newPackageId = 'pkg-mock-' + Date.now();
      setPackageId(newPackageId);
      console.log('Package created:', newPackageId);
      setCurrentStep('production');
      startProduction();
    }, 1000);
  };

  const startProduction = () => {
    setIsProducing(true);
    
    // Initialize all as pending
    setProductionStatus({
      front: 'pending',
      back: 'pending',
      left: 'pending',
      right: 'pending',
      top: 'pending',
      bottom: 'pending',
      lifestyle: 'pending',
      model3d: 'pending',
    });

    // Simulate progressive generation
    const views = ['front', 'back', 'left', 'right', 'top', 'bottom', 'lifestyle', 'model3d'] as const;
    views.forEach((view, index) => {
      setTimeout(() => {
        setProductionStatus(prev => ({ ...prev, [view]: 'processing' }));
        
        setTimeout(() => {
          setProductionStatus(prev => ({ ...prev, [view]: 'completed' }));
          
          // All completed
          if (index === views.length - 1) {
            setIsProducing(false);
          }
        }, 2000 + Math.random() * 1000);
      }, index * 500);
    });
  };

  const handleRetry = (view: keyof ProductionStatus) => {
    setProductionStatus(prev => ({ ...prev, [view]: 'processing' }));
    setTimeout(() => {
      setProductionStatus(prev => ({ ...prev, [view]: 'completed' }));
    }, 2000);
  };

  const handleFinalize = () => {
    setIsFinalizing(true);
    setTimeout(() => {
      setIsFinalizing(false);
      setCurrentStep('finalize');
    }, 2000);
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'processing':
        return <Loader2 size={16} className="animate-spin text-primary-500" />;
      case 'completed':
        return <Check size={16} className="text-green-500" />;
      case 'failed':
        return <AlertCircle size={16} className="text-red-500" />;
      default:
        return <div className="w-4 h-4 rounded-full border-2 border-gray-300" />;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center">
                <Sparkles size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Design Packaging Workshop</h2>
                <p className="text-sm text-gray-500">Transform your design into a complete package</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 px-6 py-4 bg-gray-50 border-b border-gray-100">
            {[
              { key: 'metadata', label: 'Metadata' },
              { key: 'production', label: 'Production' },
              { key: 'finalize', label: 'Finalize' },
            ].map((step, index) => (
              <div key={step.key} className="flex items-center gap-2">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                  currentStep === step.key 
                    ? 'bg-primary-100 text-primary-700' 
                    : index < ['metadata', 'production', 'finalize'].indexOf(currentStep)
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-xs">
                    {index + 1}
                  </span>
                  {step.label}
                </div>
                {index < 2 && <div className="w-8 h-0.5 bg-gray-200" />}
              </div>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Step 1: Metadata Input */}
            {currentStep === 'metadata' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  {/* Left: Reference Image */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Reference Image</label>
                    <div className="aspect-square bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center">
                      <div className="text-center text-gray-400">
                        <p className="text-sm">Selected Canvas Image</p>
                        <p className="text-xs mt-1">ID: {selectedImageId || 'None'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Right: Metadata Form */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-2">Title *</label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., Urban Runner Black & White"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-2">Description *</label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe the design concept..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-2">Brand Name</label>
                      <input
                        type="text"
                        value={brandName}
                        onChange={(e) => setBrandName(e.target.value)}
                        placeholder="e.g., UrbanFit"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-2">Keywords</label>
                      <input
                        type="text"
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                        placeholder="modern, sleek, urban (comma-separated)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-100">
                  <Button
                    onClick={handleCreatePackage}
                    disabled={!title || !description}
                    className="px-6"
                  >
                    Start Production →
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Production Pipeline */}
            {currentStep === 'production' && (
              <div className="space-y-6">
                <div className="bg-primary-50 border border-primary-200 rounded-xl p-4">
                  <p className="text-sm text-primary-700">
                    <Loader2 size={14} className="inline animate-spin mr-2" />
                    Generating production assets... This may take a few minutes.
                  </p>
                </div>

                {/* 6-View Standard Shots */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Standard Views (6-View)</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {(['front', 'back', 'left', 'right', 'top', 'bottom'] as const).map((view) => (
                      <div key={view} className="relative">
                        <div className="aspect-square bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center relative overflow-hidden">
                          {productionStatus[view] === 'completed' && (
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100" />
                          )}
                          {productionStatus[view] === 'processing' && (
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
                          )}
                          <div className="relative z-10 text-center">
                            {getStatusIcon(productionStatus[view])}
                            <p className="text-xs text-gray-600 mt-2 capitalize">{view}</p>
                          </div>
                        </div>
                        {productionStatus[view] === 'failed' && (
                          <button
                            onClick={() => handleRetry(view)}
                            className="absolute top-2 right-2 p-1 bg-white rounded shadow-sm hover:bg-gray-50"
                          >
                            <RefreshCw size={12} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Lifestyle Shot */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Lifestyle Model Shot</h3>
                  <div className="aspect-video bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center relative overflow-hidden">
                    {productionStatus.lifestyle === 'completed' && (
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-orange-100" />
                    )}
                    {productionStatus.lifestyle === 'processing' && (
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
                    )}
                    <div className="relative z-10">
                      {getStatusIcon(productionStatus.lifestyle)}
                      <p className="text-xs text-gray-600 mt-2">Lifestyle Context</p>
                    </div>
                  </div>
                </div>

                {/* 3D Asset */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">3D Asset</h3>
                  <div className="h-24 bg-gray-100 rounded-lg border border-gray-200 flex items-center px-4 justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(productionStatus.model3d)}
                      <div>
                        <p className="text-sm font-medium text-gray-700">3D Model (GLB)</p>
                        <p className="text-xs text-gray-500">High-quality mesh export</p>
                      </div>
                    </div>
                    {productionStatus.model3d === 'processing' && (
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-primary-500 animate-pulse" style={{ width: '60%' }} />
                        </div>
                        60%
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-gray-100">
                  <Button variant="ghost" onClick={() => setCurrentStep('metadata')}>
                    ← Back
                  </Button>
                  <Button
                    onClick={handleFinalize}
                    disabled={isProducing || Object.values(productionStatus).some(s => s !== 'completed')}
                    className="px-6"
                  >
                    {isFinalizing ? (
                      <>
                        <Loader2 size={16} className="animate-spin mr-2" />
                        Finalizing...
                      </>
                    ) : (
                      'Finalize Package →'
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Finalize */}
            {currentStep === 'finalize' && (
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                  <Check size={40} className="text-green-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Package Created Successfully!</h3>
                  <p className="text-gray-600">Your design package is ready and has been added to the gallery.</p>
                </div>
                <div className="flex gap-3">
                  <Button variant="ghost" onClick={onClose}>
                    Back to Canvas
                  </Button>
                  <Button onClick={() => window.location.href = '/gallery'}>
                    View in Gallery →
                  </Button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
