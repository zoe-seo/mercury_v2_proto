import { Trash2, Loader2 } from 'lucide-react'
import type { Resource } from '@/types/api/resource'
import { formatDateTime } from '@/utils/formatDate'

interface ComponentAProps {
  resource: Resource
  onDelete: (id: number) => void
  isDeleting: boolean
}

export function ComponentA({ resource, onDelete, isDeleting }: ComponentAProps) {
  return (
    <div className="p-4 border rounded-lg bg-card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2">{resource.title}</h3>
          <p className="text-muted-foreground mb-3">{resource.description}</p>
          <div className="text-xs text-muted-foreground">
            <p>Created: {formatDateTime(resource.createdAt)}</p>
            <p>Updated: {formatDateTime(resource.updatedAt)}</p>
          </div>
        </div>
        <button
          onClick={() => onDelete(resource.id)}
          disabled={isDeleting}
          className="p-2 text-destructive hover:bg-destructive/10 rounded-md transition-colors disabled:opacity-50"
          aria-label="Delete resource"
        >
          {isDeleting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  )
}
