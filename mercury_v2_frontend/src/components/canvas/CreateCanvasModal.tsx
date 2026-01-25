import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { Button } from '../common/Button';
import { useCreateCanvasProject, useCanvasProjects } from '../../queries/useCanvas';
import { useNavigate } from 'react-router-dom';

interface CreateCanvasModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateCanvasModal = ({ isOpen, onClose }: CreateCanvasModalProps) => {
  const [activeTab, setActiveTab] = useState<'new' | 'recent'>('new');
  const [canvasName, setCanvasName] = useState('Untitled Canvas');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { mutate: createCanvas, isPending } = useCreateCanvasProject();
  const { data: recentCanvases } = useCanvasProjects({ page: 1, page_size: 5 });

  const handleCreate = () => {
    setError(null);
    createCanvas(
      {
        name: canvasName,
        project_id: selectedProjectId || undefined,
      },
      {
        onSuccess: (data) => {
          navigate(`/canvas/${data.id}`);
          onClose();
        },
        onError: (err: any) => {
          console.error('Canvas creation failed:', err);
          if (err.response?.status === 401) {
            setError('로그인이 필요합니다. 다시 로그인해 주세요.');
            // 2초 후 로그인 페이지로 리다이렉트
            setTimeout(() => {
              localStorage.removeItem('accessToken');
              navigate('/login');
              onClose();
            }, 2000);
          } else {
            setError(err.response?.data?.error?.message || '캔버스 생성에 실패했습니다.');
          }
        },
      }
    );
  };

  const handleRecentCanvasClick = (canvasId: string) => {
    navigate(`/canvas/${canvasId}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">Create New Canvas</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => setActiveTab('new')}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'new'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              New Canvas
            </button>
            <button
              onClick={() => setActiveTab('recent')}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'recent'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Recent Canvases
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'new' ? (
              <div className="space-y-4">
                {/* Canvas Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Canvas Name
                  </label>
                  <input
                    type="text"
                    value={canvasName}
                    onChange={(e) => setCanvasName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Untitled Canvas"
                    maxLength={100}
                    autoFocus
                  />
                </div>

                {/* Project Select */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project (Optional)
                  </label>
                  <select
                    value={selectedProjectId || ''}
                    onChange={(e) => setSelectedProjectId(e.target.value || null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">None (Standalone)</option>
                    {/* TODO: Load projects from API */}
                  </select>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                {/* Create Button */}
                <Button
                  onClick={handleCreate}
                  disabled={!canvasName.trim() || isPending}
                  className="w-full mt-6"
                >
                  {isPending ? (
                    <>
                      <Loader2 size={16} className="animate-spin mr-2" />
                      Creating...
                    </>
                  ) : (
                    'Create & Start'
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {recentCanvases?.items && recentCanvases.items.length > 0 ? (
                  <>
                    {recentCanvases.items.slice(0, 5).map((canvas) => (
                      <button
                        key={canvas.id}
                        onClick={() => handleRecentCanvasClick(canvas.id)}
                        className="w-full p-3 text-left rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                      >
                        <div className="font-medium text-gray-900">{canvas.name}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          Updated {new Date(canvas.updated_at).toLocaleDateString()}
                        </div>
                      </button>
                    ))}
                    <button
                      onClick={() => {
                        navigate('/canvas');
                        onClose();
                      }}
                      className="w-full p-3 text-center text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                      View all canvases →
                    </button>
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">No recent canvases</p>
                    <button
                      onClick={() => setActiveTab('new')}
                      className="mt-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Create your first canvas
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
