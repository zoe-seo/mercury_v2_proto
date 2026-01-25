import type { DesignBrief } from './designBrief';

export interface ReferenceItem {
  id: string;
  image_url: string;
  title: string;
  brief_data: Partial<DesignBrief>;
}

export interface ReferenceGalleryResponse {
  items: ReferenceItem[];
  total: number;
}
