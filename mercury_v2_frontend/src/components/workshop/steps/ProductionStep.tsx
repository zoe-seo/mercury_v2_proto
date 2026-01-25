import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle2, Box, Image as ImageIcon, ArrowRight, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '../../common/Button';
import { useProductionStatus, useStart2DProduction, useStart3DProduction } from '../../../queries/useDesignPackage';
import type { AssetType, ProductionAsset } from '../../../types/designPackage';
import { cn } from '../../../utils/cn';

interface ProductionStepProps {
  packageId: string;
  onComplete: () => void;
}

export const ProductionStep = ({ packageId, onComplete }: ProductionStepProps) => {
  const { data: status, isLoading } = useProductionStatus(packageId);
  const { mutate: start2D, isPending: isStarting2D } = useStart2DProduction();
  const { mutate: start3D, isPending: isStarting3D } = useStart3DProduction();

  // Auto-start 2D if just created (draft)
  useEffect(() => {
    if (status?.package_status === 'draft') {
        start2D({ packageId });
    }
  }, [status?.package_status, packageId, start2D]);

  const assets = status?.assets || [];
  
  // Group Assets
  const views2D = assets.filter(a => a.type.startsWith('6view_'));
  const modelShot = assets.find(a => a.type === 'model_shot');
  const model3D = assets.find(a => a.type === '3d_model');

  const is2DCompleted = status?.package_status === '2d_completed' || status?.package_status === '3d_processing' || status?.package_status === '3d_completed' || status?.package_status === 'completed';
  const is3DProcessing = status?.package_status === '3d_processing';
  const is3DCompleted = status?.package_status === '3d_completed' || status?.package_status === 'completed';

  const handleStart3D = () => {
      start3D({ packageId });
  };

  return (
    <div className="flex h-full flex-col">
       {/* Info Banner */}
       {!is3DCompleted && (
          <div className="px-6 py-3 bg-primary-50 border-b border-primary-100 flex items-center gap-3">
             <Loader2 size={14} className="animate-spin text-primary-600" />
             <p className="text-sm text-primary-700 font-medium">
                {is3DProcessing ? 'Constructing 3D Model...' : 'Generating 2D Views... This takes a moment.'}
             </p>
          </div>
       )}

       {/* Main Content */}
       <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
           <div className="grid grid-cols-12 gap-6 h-full">
               
               {/* Left: 2D Assets */}
               <div className="col-span-7 flex flex-col gap-4">
                   <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                       <ImageIcon size={16} /> 
                       Standard Views
                       {is2DCompleted && <CheckCircle2 size={14} className="text-green-500" />}
                   </h3>
                   
                   <div className="grid grid-cols-2 gap-3">
                       {['front', 'back', 'left', 'right', 'top', 'bottom'].map((view) => {
                           const asset = views2D.find(a => a.type === `6view_${view}`);
                           return (
                               <AssetCard 
                                    key={view} 
                                    title={view.charAt(0).toUpperCase() + view.slice(1)} 
                                    asset={asset} 
                               />
                           );
                       })}
                   </div>
               </div>

               {/* Right: 3D & Lifestyle */}
               <div className="col-span-5 flex flex-col gap-6">
                   
                   {/* Lifestyle */}
                   <div className="flex flex-col gap-3">
                       <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                           <ImageIcon size={16} /> Lifestyle Shot
                       </h3>
                       <div className="aspect-video w-full">
                           <AssetCard title="Model Fitting" asset={modelShot} className="h-full" />
                       </div>
                   </div>

                   {/* 3D Action Area */}
                   <div className="flex-1 flex flex-col gap-3">
                       <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                           <Box size={16} /> 3D Construction
                           {is3DCompleted && <CheckCircle2 size={14} className="text-green-500" />}
                       </h3>
                       
                       <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center p-4 relative overflow-hidden">
                           {!is2DCompleted ? (
                               <div className="text-center text-gray-400 text-sm">
                                   <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                                       <Loader2 size={20} className="animate-spin opacity-50" />
                                   </div>
                                   Waiting for 2D views...
                               </div>
                           ) : !model3D ? (
                               <div className="text-center w-full px-4">
                                   <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-3 text-primary-600">
                                       <Box size={24} />
                                   </div>
                                   <p className="text-gray-900 font-semibold mb-1">2D Assets Ready</p>
                                   <p className="text-xs text-gray-500 mb-4">Proceed to generate the 3D model.</p>
                                   
                                   <Button 
                                        onClick={handleStart3D} 
                                        disabled={isStarting3D}
                                        className="w-full bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-500/20"
                                    >
                                       {isStarting3D ? <Loader2 size={16} className="animate-spin mr-2" /> : <Box size={16} className="mr-2" />}
                                       Start 3D Production
                                   </Button>
                               </div>
                           ) : (
                               // 3D Asset Display
                               <AssetCard title="3D Model (GLB)" asset={model3D} className="h-full w-full border-none bg-transparent" />
                           )}
                       </div>
                   </div>

               </div>
           </div>
       </div>
       
       {/* Footer */}
       <div className="p-6 border-t border-gray-100 bg-white flex justify-between items-center">
            <div className="text-xs text-gray-400">
                Process ID: {packageId.split('-')[1] || '...'}
            </div>
            
             {is3DCompleted ? (
                 <Button onClick={onComplete} className="bg-gray-900 hover:bg-black text-white px-8">
                     Finalize Package <ArrowRight size={16} className="ml-2" />
                 </Button>
             ) : (
                 <Button disabled variant="ghost" className="text-gray-400">
                     Processing...
                 </Button>
             )}
       </div>
    </div>
  );
};


// Helper Component for Asset Display
const AssetCard = ({ title, asset, className }: { title: string, asset?: ProductionAsset, className?: string }) => {
    const isCompleted = asset?.status === 'completed';
    const isProcessing = asset?.status === 'processing';
    const isPending = !asset || asset.status === 'pending';
    const isFailed = asset?.status === 'failed';

    return (
        <div className={cn("bg-white rounded-lg border border-gray-200 overflow-hidden relative group transition-all", isProcessing && "ring-2 ring-primary-100", className)}>
            {/* Header / Status Badge */}
            <div className="absolute top-2 left-2 z-10 bg-black/50 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
                {title}
            </div>

            <div className="w-full h-full min-h-[140px] flex items-center justify-center bg-gray-50">
                {isCompleted && asset?.asset_url ? (
                    <img src={asset.asset_url} alt={title} className="w-full h-full object-cover" />
                ) : isProcessing ? (
                    <div className="flex flex-col items-center gap-2 text-primary-600">
                        <Loader2 size={24} className="animate-spin" />
                        {/* Shimmer Effect Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 animate-shimmer" />
                    </div>
                ) : isFailed ? (
                     <div className="flex flex-col items-center gap-1 text-red-400">
                        <AlertCircle size={24} />
                        <span className="text-xs">Failed</span>
                        {/* Retry Button could go here */}
                    </div>
                ) : (
                    <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center">
                         <span className="text-gray-300 text-xs">Pending...</span>
                    </div>
                )}
            </div>

            {/* Hover Actions (Retry) */}
            {isCompleted && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 border border-white/40">
                        <RefreshCw size={14} className="mr-2" /> Regenerate
                    </Button>
                </div>
            )}
        </div>
    );
}
