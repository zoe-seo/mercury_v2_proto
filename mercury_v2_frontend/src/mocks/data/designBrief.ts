import type { DesignBrief } from '../../types/api/designBrief';

export const mockDesignBrief: DesignBrief = {
  id: 'brief-mock-001',
  chat_session_id: 'session-mock-001',
  concept_info: {
    theme: 'Minimalist Urban Runner',
    target_audience: {
      gender: 'unisex',
      age_group: '20s'
    },
    overall_tone: 'Clean, Modern, Tech-driven'
  },
  shoe_spec: {
    category: 'Running',
    upper_material: 'Mesh & Synthetic',
    sole_type: 'Chunk sole',
    key_colors: ['#000000', '#FFFFFF', '#FF4500']
  },
  marketing_context: {
    season: '2024 SS',
    price_point: 'Mid-High',
    competitors: ['Nike Pegasus', 'Adidas Ultraboost']
  },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

export const emptyDesignBrief: DesignBrief = {
  id: 'brief-new-001',
  concept_info: {},
  shoe_spec: {},
  marketing_context: {},
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};
