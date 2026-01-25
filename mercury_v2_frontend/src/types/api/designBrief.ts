export interface ConceptInfo {
  theme?: string;
  target_audience?: {
    gender?: 'men' | 'women' | 'unisex';
    age_group?: '10s' | '20s' | '30s' | '40s' | '50s+';
  };
  overall_tone?: string;
}

export interface ShoeSpec {
  category?: string;
  upper_material?: string;
  sole_type?: string;
  key_colors?: string[]; // HEX codes
}

export interface MarketingContext {
  season?: string;
  price_point?: string;
  competitors?: string[];
}

export interface DesignBrief {
  id: string;
  chat_session_id?: string;
  canvas_project_id?: string;
  concept_info: ConceptInfo;
  shoe_spec: ShoeSpec;
  marketing_context: MarketingContext;
  reference_image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface DesignBriefCreate {
  concept_info?: ConceptInfo;
  shoe_spec?: ShoeSpec;
  marketing_context?: MarketingContext;
  reference_image_url?: string;
}

export interface DesignBriefUpdate {
  concept_info?: ConceptInfo;
  shoe_spec?: ShoeSpec;
  marketing_context?: MarketingContext;
  reference_image_url?: string;
}
