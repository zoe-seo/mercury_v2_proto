import { useState } from 'react'
import { useResourceList, useCreateResource, useDeleteResource } from '@/queries/useResourceList'
import { Loader2, Plus } from 'lucide-react'
import { ComponentA } from '@/components/pageA'

export function PageA() {
  const { data: resources, isLoading, error } = useResourceList()
  const createResource = useCreateResource()
  const deleteResource = useDeleteResource()
  const [newTitle, setNewTitle] = useState('')
  const [newDescription, setNewDescription] = useState('')

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return

    await createResource.mutateAsync({
      title: newTitle,
      description: newDescription,
    })

    setNewTitle('')
    setNewDescription('')
  }

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this resource?')) {
      await deleteResource.mutateAsync(id)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 border border-destructive rounded-md bg-destructive/10">
        <p className="text-destructive">Error loading resources: {error.message}</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Page A - TanStack Query Example</h1>

      {/* Create Form */}
      <form onSubmit={handleCreate} className="mb-8 p-6 border rounded-lg bg-card">
        <h2 className="text-xl font-semibold mb-4">Create New Resource</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-background"
              placeholder="Enter title"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-background"
              rows={3}
              placeholder="Enter description"
            />
          </div>
          <button
            type="submit"
            disabled={createResource.isPending}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {createResource.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            Create Resource
          </button>
        </div>
      </form>

      {/* Resource List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Resources</h2>
        {resources && resources.length > 0 ? (
          resources.map((resource) => (
            <ComponentA
              key={resource.id}
              resource={resource}
              onDelete={handleDelete}
              isDeleting={deleteResource.isPending}
            />
          ))
        ) : (
          <p className="text-muted-foreground">No resources found. Create one above!</p>
        )}
      </div>
    </div>
  )
}
