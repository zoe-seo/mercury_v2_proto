export interface CanvasLayer {
  id: string;
  type: 'image' | 'shape' | 'text';
  name: string;
  visible: boolean;
  locked: boolean;
  // Position & properties for rendering
  x: number;
  y: number;
  width?: number;
  height?: number;
  content?: string; // Image URL or Text content
  color?: string;
  thumbnailUrl?: string; // For layer panel
}

export const mockLayers: CanvasLayer[] = [
  {
    id: 'l1',
    type: 'image',
    name: 'Reference Shoe',
    visible: true,
    locked: false,
    x: 100,
    y: 100,
    width: 400,
    height: 300,
    content: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=50'
  },
  {
    id: 'l2',
    type: 'shape',
    name: 'Accent Circle',
    visible: true,
    locked: false,
    x: 400,
    y: 150,
    width: 100,
    height: 100,
    color: '#FF6B4A', // Coral
  },
  {
    id: 'l3',
    type: 'text',
    name: 'Label: "Air Flow"',
    visible: true,
    locked: true,
    x: 120,
    y: 80,
    content: 'Air Flow Concept',
    color: '#333',
  }
];
