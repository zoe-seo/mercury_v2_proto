import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { useCanvasProjects, useDeleteCanvasProject } from '../queries/useCanvas';
import { Button } from '../components/common/Button';
import { Plus, Search, Trash2, Loader2 } from 'lucide-react';
import { CreateCanvasModal } from '../components/canvas/CreateCanvasModal';

export const CanvasListPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const navigate = useNavigate();
  const { data: canvasesData, isLoading } = useCanvasProjects({ page: 1, page_size: 50 });
  const { mutate: deleteCanvas, isPending: isDeleting } = useDeleteCanvasProject();

  const filteredCanvases = canvasesData?.items.filter((canvas) =>
    canvas.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (canvasId: string) => {
    deleteCanvas(canvasId, {
      onSuccess: () => {
        setDeleteConfirmId(null);
      },
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Canvases</h1>
          <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
            <Plus size={20} />
            New Canvas
          </Button>
        </div>

        {/* Filter Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search canvases..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Canvas Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-primary-500" />
          </div>
        ) : filteredCanvases && filteredCanvases.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCanvases.map((canvas) => (
              <div
                key={canvas.id}
                className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/canvas/${canvas.id}`)}
              >
                {/* Thumbnail */}
                <div className="aspect-video bg-gray-100 flex items-center justify-center">
                  {canvas.thumbnail_url ? (
                    <img
                      src={canvas.thumbnail_url}
                      alt={canvas.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-gray-400">
                      <svg
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <path d="M9 12h6M12 9v6" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 truncate mb-1">
                    {canvas.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Updated {new Date(canvas.updated_at).toLocaleDateString()}
                  </p>

                  {/* Actions */}
                  <div className="mt-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirmId(canvas.id);
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-gray-400 mb-4">
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="mx-auto"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M9 12h6M12 9v6" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No canvases yet</h3>
            <p className="text-gray-500 mb-6">Create your first canvas to get started</p>
            <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
              <Plus size={20} />
              Create Canvas
            </Button>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setDeleteConfirmId(null)}
            />
            <div className="relative bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Delete Canvas?
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to delete this canvas? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  onClick={() => setDeleteConfirmId(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleDelete(deleteConfirmId)}
                  disabled={isDeleting}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 size={16} className="animate-spin mr-2" />
                      Deleting...
                    </>
                  ) : (
                    'Delete'
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Create Canvas Modal */}
        <CreateCanvasModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      </div>
    </Layout>
  );
};
