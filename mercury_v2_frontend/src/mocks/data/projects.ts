import type { Project, DesignItem } from '../../types/api/projects';

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    name: '2026 Spring Collection',
    description: 'Fresh styles for the upcoming spring season.',
    created_at: '2026-01-15T10:00:00Z',
    updated_at: '2026-01-20T15:30:00Z',
    design_count: 5,
  },
  {
    id: 'proj-2',
    name: 'Urban Streetwear',
    description: 'Bold designs for the city streets.',
    created_at: '2026-01-10T09:00:00Z',
    updated_at: '2026-01-22T11:00:00Z',
    design_count: 12,
  },
  {
    id: 'proj-3',
    name: 'Eco-Friendly Line',
    created_at: '2026-01-05T14:00:00Z',
    updated_at: '2026-01-18T16:20:00Z',
    design_count: 3,
  },
];

export const MOCK_RECENT_DESIGNS: DesignItem[] = [
  {
    id: 'canvas-1',
    type: 'canvas',
    title: 'Pegasus Running Shoe Concept',
    thumbnail_url: 'https://placehold.co/600x400/e2e8f0/475569?text=Shoe+Sketch',
    updated_at: '2026-01-25T10:30:00Z',
    project_id: 'proj-1',
    project_name: '2026 Spring Collection',
  },
  {
    id: 'chat-1',
    type: 'chat',
    title: 'Minimalist Sneaker Research',
    description: 'Looking for a clean, white leather sneaker design with subtle perforation details...',
    updated_at: '2026-01-24T15:45:00Z',
    project_id: 'proj-2',
    project_name: 'Urban Streetwear',
  },
  {
    id: 'canvas-2',
    type: 'canvas',
    title: 'High-top Basketball Shoe',
    thumbnail_url: 'https://placehold.co/600x400/e2e8f0/475569?text=High+Top',
    updated_at: '2026-01-23T09:12:00Z',
  },
  {
    id: 'chat-2',
    type: 'chat',
    title: 'Future Tech Runner',
    description: 'Design a futuristic running shoe with neon accents and transparent sole...',
    updated_at: '2026-01-22T18:00:00Z',
    project_id: 'proj-1',
    project_name: '2026 Spring Collection',
  },
];
