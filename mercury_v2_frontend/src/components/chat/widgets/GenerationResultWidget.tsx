import { useEffect, useState } from 'react';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '@/utils/api';

interface GenerationResultWidgetProps {
  taskId?: string;
  imageUrl?: string;
  status?: string;
}

export const GenerationResultWidget = ({ taskId, imageUrl, status }: GenerationResultWidgetProps) => {
  const [generationStatus, setGenerationStatus] = useState(status || 'generating');
  const [finalImageUrl, setFinalImageUrl] = useState<string | null>(imageUrl || null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!taskId || generationStatus === 'completed' || generationStatus === 'failed') {
      return;
    }

    // Poll for task status
    const pollInterval = setInterval(async () => {
      try {
        const { data } = await api.get(`/api/v1/chat/tasks/${taskId}`);

        console.log('[GenerationResultWidget] Task status:', data);

        setGenerationStatus(data.status);

        if (data.status === 'completed' && data.image_url) {
          setFinalImageUrl(data.image_url);
          clearInterval(pollInterval);
        } else if (data.status === 'failed') {
          setError(data.error || 'Image generation failed');
          clearInterval(pollInterval);
        }
      } catch (err) {
        console.error('[GenerationResultWidget] Error polling task:', err);
        setError('Failed to check generation status');
        clearInterval(pollInterval);
      }
    }, 2000); // Poll every 2 seconds

    // Cleanup
    return () => clearInterval(pollInterval);
  }, [taskId, generationStatus]);

  if (generationStatus === 'generating' || generationStatus === 'pending') {
    return (
      <div className="mt-3 p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
            <div className="absolute inset-0 w-12 h-12 border-4 border-indigo-200 rounded-full animate-ping opacity-20" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              Generating your design...
            </h3>
            <p className="text-sm text-gray-600">
              This may take 10-30 seconds. Please wait.
            </p>
          </div>
          <div className="w-full max-w-xs bg-gray-200 rounded-full h-2 overflow-hidden">
            <div className="bg-indigo-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }} />
          </div>
        </div>
      </div>
    );
  }

  if (generationStatus === 'failed' || error) {
    return (
      <div className="mt-3 p-6 bg-red-50 rounded-2xl border border-red-200">
        <div className="flex items-center space-x-3">
          <AlertCircle className="w-8 h-8 text-red-600 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold text-red-800 mb-1">
              Generation Failed
            </h3>
            <p className="text-sm text-red-600">
              {error || 'Something went wrong while generating your design.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (generationStatus === 'completed' && finalImageUrl) {
    return (
      <div className="mt-3 space-y-3">
        {/* Success Badge */}
        <div className="flex items-center space-x-2 text-green-600">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-sm font-medium">Generation Complete!</span>
        </div>

        {/* Generated Image */}
        <div className="relative group rounded-2xl overflow-hidden border-2 border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
          <img
            src={finalImageUrl}
            alt="Generated Shoe Design"
            className="w-full h-auto object-cover bg-gray-50"
            onError={(e) => {
              console.error('[GenerationResultWidget] Image failed to load:', finalImageUrl);
              (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Image+Load+Error';
            }}
          />

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center">
            <button className="opacity-0 group-hover:opacity-100 transition-opacity bg-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
              View Full Size
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
            Regenerate
          </button>
          <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
            Save to Project
          </button>
        </div>
      </div>
    );
  }

  return null;
};
