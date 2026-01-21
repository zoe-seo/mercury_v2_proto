import { create } from 'zustand'

interface EditorState {
  content: string
  isDirty: boolean
  setContent: (content: string) => void
  reset: () => void
}

export const useEditorStore = create<EditorState>((set) => ({
  content: '',
  isDirty: false,
  setContent: (content) => set({ content, isDirty: true }),
  reset: () => set({ content: '', isDirty: false }),
}))
