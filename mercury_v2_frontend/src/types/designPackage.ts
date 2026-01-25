export interface DesignPackage {
  id: string;
  title: string;
  description: string;
  project_id?: string;
  metadata?: {
    brand_info?: {
      brand_name: string;
      target_audience: string;
      price_range: string;
    };
    keywords?: string[];
  };
  status: 'draft' | '2d_processing' | '2d_completed' | '3d_processing' | '3d_completed' | 'completed';
  created_at: string;
}

export type AssetType = 
  | '6view_front' | '6view_back' | '6view_left' | '6view_right' | '6view_top' | '6view_bottom' 
  | 'model_shot' 
  | '3d_model';

export type AssetStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface ProductionAsset {
  type: AssetType;
  status: AssetStatus;
  asset_url?: string;
  thumbnail_url?: string;
  progress?: number;
  retry_count?: number;
}

export interface ProductionStatus {
  package_status: DesignPackage['status'];
  assets: ProductionAsset[];
}

export interface CreatePackageRequest {
  title: string;
  description: string;
  project_id?: string;
  metadata: {
    brand_info: {
      brand_name: string;
      target_audience: string;
      price_range: string;
    };
  };
  initial_image_id?: string; // Ref image from canvas
}
