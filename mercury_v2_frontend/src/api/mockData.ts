export interface Project {
  id: string;
  name: string;
  type: 'chat' | 'canvas';
  updatedAt: string; // ISO date string or relative like "2 hours ago"
  thumbnailUrl?: string; // Optional
}

export interface Design {
  id: string;
  name: string;
  createdAt: string;
  thumbnailUrl?: string;
}

export const mockProjects: Project[] = [
  {
    id: 'p1',
    name: '2026 Spring Collection',
    type: 'chat',
    updatedAt: '2 hours ago',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=500', 
  },
  {
    id: 'p2',
    name: 'Urban Runner Concept',
    type: 'canvas',
    updatedAt: '1 day ago',
    thumbnailUrl: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80&w=500',
  },
  {
    id: 'p3',
    name: 'Eco-Friendly Hiking',
    type: 'chat',
    updatedAt: '3 days ago',
    thumbnailUrl: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=500',
  },
  {
    id: 'p4',
    name: 'Futuristic Sneaker',
    type: 'canvas',
    updatedAt: '1 week ago',
    // No thumbnail to test empty state
  },
];

export const mockDesigns: Design[] = [
  {
    id: 'd1',
    name: 'Minimalist White',
    createdAt: 'Jan 22, 2026',
    thumbnailUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=500',
  },
  {
    id: 'd2',
    name: 'Neon Night',
    createdAt: 'Jan 21, 2026',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&q=80&w=500',
  },
  {
    id: 'd3',
    name: 'Classic Leather',
    createdAt: 'Jan 20, 2026',
    thumbnailUrl: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&q=80&w=500',
  },
  {
    id: 'd4',
    name: 'Sporty Red',
    createdAt: 'Jan 18, 2026',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=500',
  },
  {
    id: 'd5',
    name: 'Urban Grey',
    createdAt: 'Jan 15, 2026',
    thumbnailUrl: 'https://images.unsplash.com/photo-1605348532760-6753d5c43329?auto=format&fit=crop&q=80&w=500',
  },
  {
    id: 'd6',
    name: 'Canvas High',
    createdAt: 'Jan 10, 2026',
    // No thumbnail
  },
];

export const mockStats = {
  totalDesigns: 24,
  thisWeek: 5,
  storage: '2.3GB',
};

// Chat Related Types
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  images?: string[]; // URLs of generated images
}

export interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  updatedAt: string; // Relative time
  messages: Message[];
}

export const mockSessions: ChatSession[] = [
  {
    id: 's1',
    title: 'Futuristic Running Shoes',
    lastMessage: 'Here are 4 variations based on your request.',
    updatedAt: '2 mins ago',
    messages: [
      {
        id: 'm1',
        role: 'system',
        content: 'Started new design session',
        timestamp: '10:00 AM'
      },
      {
        id: 'm2',
        role: 'assistant',
        content: 'Hello! What kind of shoe design are you looking for today?',
        timestamp: '10:00 AM'
      },
      {
        id: 'm3',
        role: 'user',
        content: 'I want a futuristic running shoe with neon accents.',
        timestamp: '10:01 AM'
      },
      {
        id: 'm4',
        role: 'assistant',
        content: 'Sure! Generating some concepts for futuristic running shoes with neon lights...',
        timestamp: '10:01 AM',
        images: [
           'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=500',
           'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=500',
           'https://images.unsplash.com/photo-1605348532760-6753d5c43329?auto=format&fit=crop&q=80&w=500',
           'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&q=80&w=500'
        ]
      }
    ]
  },
  {
    id: 's2',
    title: 'Vintage Leather Boots',
    lastMessage: 'I like the second one, can we make it darker?',
    updatedAt: '1 day ago',
    messages: []
  },
  {
    id: 's3',
    title: 'Minimalist Sneakers',
    lastMessage: 'Generating final marketing report...',
    updatedAt: '3 days ago',
    messages: []
  }
];
