import type { ChatSession, Message } from '../types/richChat';

export const MOCK_SESSIONS: ChatSession[] = [
  {
    id: 'sess_001',
    title: 'Red Running Shoes',
    updated_at: '2026-01-26T10:30:00Z',
    current_step: 'outline',
    thumbnail_url: 'https://placehold.co/100x100?text=Shoe'
  },
  {
    id: 'sess_002',
    title: 'Vintage Leather Boots',
    updated_at: '2026-01-25T14:20:00Z',
    current_step: 'result'
  }
];

export const MOCK_HISTORY: Message[] = [
  {
    id: 'msg_001',
    role: 'assistant',
    content: '안녕하세요! 오늘은 어떤 디자인을 해볼까요?',
    widget: {
      type: 'chip_group',
      data: {
        options: [
          { id: 'p1', label: '가벼운 러닝화', value: 'Light Running' },
          { id: 'p2', label: '청키한 스니커즈', value: 'Chunky Sneakers' },
          { id: 'p3', label: '미니멀 로퍼', value: 'Minimal Loafers' }
        ],
        multi_select: false
      }
    }
  },
  {
    id: 'msg_002',
    role: 'user',
    content: '빨간색 러닝화 만들어줘'
  },
  {
    id: 'msg_003',
    role: 'assistant',
    content: '러닝화를 선택하셨군요. 디자인의 기초가 될 아웃라인(Silhouette)을 골라주세요.',
    widget: {
      type: 'selection_card',
      data: {
        multi_select: false,
        options: [
          { id: 'out_01', label: 'Sleek Runner', image_url: 'https://placehold.co/200x200?text=Sleek' },
          { id: 'out_02', label: 'Bulky Trainer', image_url: 'https://placehold.co/200x200?text=Bulky' },
          { id: 'out_03', label: 'Retro Jogger', image_url: 'https://placehold.co/200x200?text=Retro' }
        ]
      }
    }
  }
];
