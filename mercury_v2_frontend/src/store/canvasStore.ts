import { create } from 'zustand';
import type { CanvasLayer } from '../types/api/canvas';

interface HistoryState {
  past: string[]; // JSON stringified canvas states
  future: string[];
}

interface SegmentData {
  id: string;
  label: string;
  mask_data: { paths: any[] };
  color: string;
}

interface CanvasStore {
  // 선택된 객체
  selectedObjectId: string | null;
  setSelectedObjectId: (id: string | null) => void;

  // 히스토리 (Undo/Redo)
  history: HistoryState;
  canUndo: boolean;
  canRedo: boolean;
  pushHistory: (state: string) => void;
  undo: () => string | null;
  redo: () => string | null;
  clearHistory: () => void;

  // 저장 상태
  savingState: 'saved' | 'saving' | 'error';
  setSavingState: (state: 'saved' | 'saving' | 'error') => void;

  // 세그먼트 데이터
  segments: SegmentData[];
  setSegments: (segments: SegmentData[]) => void;
  selectedSegmentId: string | null;
  setSelectedSegmentId: (id: string | null) => void;

  // 레이어 데이터 (캐시용)
  layers: CanvasLayer[];
  setLayers: (layers: CanvasLayer[]) => void;

  // 활성 도구
  activeTool: 'select' | 'hand' | 'brush' | 'eraser' | 'shape' | 'text' | 'image';
  setActiveTool: (tool: 'select' | 'hand' | 'brush' | 'eraser' | 'shape' | 'text' | 'image') => void;

  // 브러시 설정
  brushSettings: {
    size: number;
    color: string;
    opacity: number;
  };
  setBrushSize: (size: number) => void;
  setBrushColor: (color: string) => void;
  setBrushOpacity: (opacity: number) => void;

  // Inpaint 모드
  inpaintMode: boolean;
  setInpaintMode: (mode: boolean) => void;
}

export const useCanvasStore = create<CanvasStore>((set, get) => ({
  // 선택된 객체
  selectedObjectId: null,
  setSelectedObjectId: (id) => set({ selectedObjectId: id }),

  // 히스토리
  history: { past: [], future: [] },
  canUndo: false,
  canRedo: false,

  pushHistory: (state) => {
    const { history } = get();
    set({
      history: {
        past: [...history.past, state],
        future: [], // 새로운 액션 시 future 초기화
      },
      canUndo: true,
      canRedo: false,
    });
  },

  undo: () => {
    const { history } = get();
    if (history.past.length === 0) return null;

    const previous = history.past[history.past.length - 1];
    const newPast = history.past.slice(0, -1);

    set({
      history: {
        past: newPast,
        future: [previous, ...history.future],
      },
      canUndo: newPast.length > 0,
      canRedo: true,
    });

    return previous;
  },

  redo: () => {
    const { history } = get();
    if (history.future.length === 0) return null;

    const next = history.future[0];
    const newFuture = history.future.slice(1);

    set({
      history: {
        past: [...history.past, next],
        future: newFuture,
      },
      canUndo: true,
      canRedo: newFuture.length > 0,
    });

    return next;
  },

  clearHistory: () => {
    set({
      history: { past: [], future: [] },
      canUndo: false,
      canRedo: false,
    });
  },

  // 저장 상태
  savingState: 'saved',
  setSavingState: (state) => set({ savingState: state }),

  // 세그먼트
  segments: [],
  setSegments: (segments) => set({ segments }),
  selectedSegmentId: null,
  setSelectedSegmentId: (id) => set({ selectedSegmentId: id }),

  // 레이어
  layers: [],
  setLayers: (layers) => set({ layers }),

  // 활성 도구
  activeTool: 'select',
  setActiveTool: (tool) => set({ activeTool: tool }),

  // 브러시 설정
  brushSettings: {
    size: 5,
    color: '#000000',
    opacity: 1,
  },
  setBrushSize: (size) =>
    set((state) => ({
      brushSettings: { ...state.brushSettings, size },
    })),
  setBrushColor: (color) =>
    set((state) => ({
      brushSettings: { ...state.brushSettings, color },
    })),
  setBrushOpacity: (opacity) =>
    set((state) => ({
      brushSettings: { ...state.brushSettings, opacity },
    })),

  // Inpaint 모드
  inpaintMode: false,
  setInpaintMode: (mode) => set({ inpaintMode: mode }),
}));
