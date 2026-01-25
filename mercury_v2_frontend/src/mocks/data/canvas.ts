import type { CanvasInstance } from "@/types/api/canvas";

export const mockCanvasInstance: CanvasInstance = {
  id: 'canvas-uuid-1',
  name: 'Urban Outdoor Concept',
  project_id: 'proj-uuid-1',
  canvas_state: {
    viewport: {
      x: 0,
      y: 0,
      zoom: 1.0
    }
  },
  created_at: '2026-01-24T10:00:00Z',
  updated_at: '2026-01-24T15:30:00Z',
  layers: [
    {
      id: 'layer-sketch-1',
      layer_type: 'sketch',
      z_index: 0,
      is_visible: true,
      layer_data: {
        x: 100,
        y: 100,
        width: 768,
        height: 768,
        paths: [] // populated in runtime usually
      }
    },
    {
      id: 'layer-image-1',
      layer_type: 'image',
      z_index: 1,
      is_visible: true,
      layer_data: {
        image_url: 'https://placehold.co/768x768/png?text=Reference+Image',
        source: 'upload',
        x: 900, // Right of sketch
        y: 100,
        width: 768,
        height: 768
      }
    },
    {
      id: 'layer-text-1',
      layer_type: 'text',
      z_index: 2,
      is_visible: true,
      layer_data: {
        text: 'Key Concept: Durable yet lightweight',
        x: 100,
        y: 50,
        font_size: 24,
        fill: '#333333'
      }
    }
  ]
};

export const mockSegments = [
  {
    id: 'seg-1',
    label: 'Outsole',
    mask_data: { paths: [] },
    color: '#FF0000'
  },
  {
    id: 'seg-2',
    label: 'Upper',
    mask_data: { paths: [] },
    color: '#00FF00'
  },
  {
    id: 'seg-3',
    label: 'Laces',
    mask_data: { paths: [] },
    color: '#0000FF'
  }
];
