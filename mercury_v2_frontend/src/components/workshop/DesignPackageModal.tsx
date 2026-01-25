import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Check } from 'lucide-react'; // Added icons
import { PackageInputStep } from './steps/PackageInputStep';
import { ProductionStep } from './steps/ProductionStep';
import { FinalizeStep } from './steps/FinalizeStep';
import type { CreatePackageRequest } from '../../types/designPackage';
import { useCreateDesignPackage } from '../../queries/useDesignPackage';

interface DesignPackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialImage: string; // The reference image from canvas
  canvasId?: string;
}

type Step = 'input' | 'production' | 'finalize';

export const DesignPackageModal = ({
  isOpen,
  onClose,
  initialImage,
  canvasId
}: DesignPackageModalProps) => {
  const [currentStep, setCurrentStep] = useState<Step>('input');
  const [packageId, setPackageId] = useState<string | null>(null);

  const { mutate: createPackage, isPending: isCreating } = useCreateDesignPackage();

  const handleInputSubmit = (data: CreatePackageRequest) => {
    createPackage(data, {
        onSuccess: (newPackage) => {
            setPackageId(newPackage.id);
            setCurrentStep('production');
        }
    });
  };

  const handleProductionComplete = () => {
      setCurrentStep('finalize');
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
          className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl h-[85vh] overflow-hidden flex flex-col"
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
              { key: 'input', label: 'Metadata' },
              { key: 'production', label: 'Production' },
              { key: 'finalize', label: 'Finalize' },
            ].map((step, index) => (
              <div key={step.key} className="flex items-center gap-2">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                  currentStep === step.key 
                    ? 'bg-primary-100 text-primary-700' 
                    : index < ['input', 'production', 'finalize'].indexOf(currentStep)
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
          <div className="flex-1 min-h-0 relative bg-white">
             {currentStep === 'input' && (
                <PackageInputStep 
                    initialImage={initialImage}
                    onSubmit={handleInputSubmit}
                    onCancel={onClose}
                    isSubmitting={isCreating}
                />
            )}
            
            {currentStep === 'production' && packageId && (
                <ProductionStep 
                    packageId={packageId}
                    onComplete={handleProductionComplete}
                />
            )}

            {currentStep === 'finalize' && packageId && (
                <FinalizeStep 
                    packageId={packageId} 
                    onClose={onClose}
                />
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
