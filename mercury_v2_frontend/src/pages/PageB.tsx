import { useEditorStore } from '@/store/editor.store'
import { Save, RotateCcw } from 'lucide-react'

export function PageB() {
  const { content, isDirty, setContent, reset } = useEditorStore()

  const handleSave = () => {
    // Simulate save
    alert('Content saved!')
    console.log('Saved content:', content)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Page B - Zustand Example</h1>

      <div className="p-6 border rounded-lg bg-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Editor</h2>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={!isDirty}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
            <button
              onClick={reset}
              disabled={!isDirty}
              className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-accent disabled:opacity-50 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-64 px-3 py-2 border rounded-md bg-background font-mono text-sm"
          placeholder="Start typing..."
        />

        <div className="mt-4 text-sm text-muted-foreground">
          Status: {isDirty ? 'Modified (unsaved)' : 'Saved'}
        </div>
      </div>

      <div className="mt-8 p-4 border rounded-md bg-muted/50">
        <h3 className="font-semibold mb-2">About this page</h3>
        <p className="text-sm text-muted-foreground">
          This page demonstrates Zustand for client-side state management. The editor state (content
          and dirty flag) is managed globally and persists across navigation.
        </p>
      </div>
    </div>
  )
}
