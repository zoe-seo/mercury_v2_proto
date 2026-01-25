import { Button } from '../../common/Button';
import { useFinalizePackage } from '../../../queries/useDesignPackage';
import { CheckCircle2, FileText, Share2, Download } from 'lucide-react';
import { useEffect } from 'react';

interface FinalizeStepProps {
  packageId: string;
  onClose: () => void;
}

export const FinalizeStep = ({ packageId, onClose }: FinalizeStepProps) => {
  const { mutate: finalize, isPending, isSuccess } = useFinalizePackage();

  useEffect(() => {
     // Auto trigger finalize on mount of this step
     finalize({ packageId });
  }, [packageId, finalize]);

  return (
    <div className="flex h-full flex-col items-center justify-center p-8 gap-6 text-center">
       
       <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-4">
           {isSuccess ? (
               <CheckCircle2 size={48} className="text-green-600" />
           ) : (
               <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
           )}
       </div>

       <div className="space-y-2">
           <h2 className="text-2xl font-bold text-gray-900">
               {isSuccess ? "Design Package Completed!" : "Finalizing Package..."}
           </h2>
           <p className="text-gray-500 max-w-md mx-auto">
               {isSuccess 
                 ? "All assets have been generated and the marketing report is ready. You can now view it in the gallery or download it."
                 : "Generating marketing report and compiling final assets. This won't take long."}
           </p>
       </div>

       {isSuccess && (
           <div className="flex gap-4 mt-6">
               <Button onClick={onClose} variant="secondary">
                   Close Workshop
               </Button>
               <Button className="bg-primary-600 text-white hover:bg-primary-700">
                   <FileText size={16} className="mr-2" />
                   View in Gallery
               </Button>
               {/* Additional post-actions */}
               <Button variant="outline" size="icon" title="Download PDF">
                   <Download size={18} />
               </Button>
               <Button variant="outline" size="icon" title="Share Link">
                   <Share2 size={18} />
               </Button>
           </div>
       )}
    </div>
  );
};
