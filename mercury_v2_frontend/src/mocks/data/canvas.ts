import type { CanvasProject } from '../../types/api/canvas';

export const mockCanvasProject: CanvasProject = {
  id: 'canvas-uuid-1',
  name: 'Sketch Design 1',
  project_id: 'proj-uuid-1',
  canvas_state: {
    viewport: { x: 0, y: 0, zoom: 1.0 },
  },
  created_at: '2026-01-20T10:00:00Z',
  updated_at: '2026-01-20T15:00:00Z',
  layers: [
    {
      id: 'layer-1',
      layer_type: 'sketch',
      name: 'Sketch Base',
      layer_data: {},
      z_index: 0,
      is_visible: true,
      is_locked: false,
    },
    {
      id: 'layer-2',
      layer_type: 'image',
      name: 'Reference Image',
      layer_data: {},
      z_index: 1,
      is_visible: true,
      is_locked: true,
    },
    {
      id: 'layer-3',
      layer_type: 'generated',
      name: 'AI Generated Texture',
      layer_data: {},
      z_index: 2,
      is_visible: true,
      is_locked: false,
    },
  ],
};

export const mockSegments = [
  { id: 'seg-1', label: 'Outsole', color: '#FF0000' },
  { id: 'seg-2', label: 'Midsole', color: '#00FF00' },
  { id: 'seg-3', label: 'Upper', color: '#0000FF' },
  { id: 'seg-4', label: 'Laces', color: '#FFFF00' },
];
