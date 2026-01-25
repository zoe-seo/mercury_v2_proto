import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios'; // We will use this but for now we mock
import type { CreatePackageRequest, DesignPackage, ProductionStatus } from '../types/designPackage';

// Mock API delays
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock Data Store (In-memory for demo)
const mockPackages: Record<string, DesignPackage> = {};
const mockAssets: Record<string, ProductionStatus> = {};

export const useCreateDesignPackage = () => {
  return useMutation({
    mutationFn: async (data: CreatePackageRequest) => {
      await sleep(1000);
      const newId = `pkg-${Date.now()}`;
      
      const newPackage: DesignPackage = {
        id: newId,
        title: data.title,
        description: data.description,
        project_id: data.project_id,
        metadata: data.metadata,
        status: 'draft',
        created_at: new Date().toISOString(),
      };
      
      mockPackages[newId] = newPackage;
      
      // Init Assets
      mockAssets[newId] = {
        package_status: 'draft',
        assets: []
      };

      console.log('Package Created:', newPackage);
      return newPackage;
    }
  });
};

export const useStart2DProduction = () => {
  return useMutation({
    mutationFn: async ({ packageId }: { packageId: string; params?: any }) => {
      await sleep(500);
      
      // Update status
      if (mockPackages[packageId]) mockPackages[packageId].status = '2d_processing';
      if (mockAssets[packageId]) {
         mockAssets[packageId].package_status = '2d_processing';
         mockAssets[packageId].assets = [
           { type: '6view_front', status: 'processing' },
           { type: '6view_back', status: 'pending' },
           { type: '6view_left', status: 'pending' },
           { type: '6view_right', status: 'pending' },
           { type: '6view_top', status: 'pending' },
           { type: '6view_bottom', status: 'pending' },
           { type: 'model_shot', status: 'pending' },
         ];
      }

      // Simulate async progress in background (normally server does this)
      simulate2DProgress(packageId);

      return { task_id: `task-${Date.now()}`, status: 'processing' };
    }
  });
};

export const useStart3DProduction = () => {
  return useMutation({
     mutationFn: async ({ packageId }: { packageId: string }) => {
        await sleep(500);
        if (mockPackages[packageId]) mockPackages[packageId].status = '3d_processing';
        if (mockAssets[packageId]) {
            mockAssets[packageId].package_status = '3d_processing';
            mockAssets[packageId].assets.push({ type: '3d_model', status: 'processing' });
        }
        
        simulate3DProgress(packageId);
        return { task_id: `task-3d-${Date.now()}`, status: 'processing' };
     }
  });
};

export const useProductionStatus = (packageId: string | null, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['productionStatus', packageId],
    queryFn: async () => {
       // Real: return axios.get(`/api/v1/design-packages/${packageId}/production/status`).then(r => r.data.data);
       if (!packageId || !mockAssets[packageId]) return null;
       return mockAssets[packageId];
    },
    enabled: !!packageId && enabled,
    refetchInterval: (query) => {
        const data = query.state.data as ProductionStatus | undefined;
        if (data?.package_status === 'completed') return false; 
        return 1000; // Poll every 1s for demo
    }
  });
};

export const useFinalizePackage = () => {
    return useMutation({
        mutationFn: async ({ packageId }: { packageId: string }) => {
            await sleep(1000);
            if (mockPackages[packageId]) mockPackages[packageId].status = 'completed';
            if (mockAssets[packageId]) mockAssets[packageId].package_status = 'completed';
            return { status: 'completed' };
        }
    });
}


// --- Simulation Helpers ---
const ASSET_IMAGES = [
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop", // Front
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop&flip=h", // Back
  "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop", // Side
  "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop&flip=h", // right
  "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=400&fit=crop", // Top
  "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=400&fit=crop&flip=v", // Bottom
  "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=400&h=600&fit=crop", // Model
];

function simulate2DProgress(packageId: string) {
    let step = 0;
    const interval = setInterval(() => {
        const status = mockAssets[packageId];
        if (!status) { clearInterval(interval); return; }

        if (step < 7) {
            status.assets[step].status = 'completed';
            status.assets[step].asset_url = ASSET_IMAGES[step];
            if (step + 1 < 7) status.assets[step + 1].status = 'processing';
        }

        step++;
        if (step >= 7) {
            status.package_status = '2d_completed'; // Ready for 3D trigger
            clearInterval(interval);
        }
    }, 1500); // Fast simulation
}

function simulate3DProgress(packageId: string) {
    setTimeout(() => {
        const status = mockAssets[packageId];
        if (status) {
            const modelAsset = status.assets.find(a => a.type === '3d_model');
            if (modelAsset) {
                modelAsset.status = 'completed';
                // Mock 3D Model URL (e.g., a sample GLB if we had one, or just a placeholder)
                modelAsset.asset_url = "https://model-viewer.googleusercontent.com/models/shoe.glb"; // Sample
            }
            status.package_status = '3d_completed';
        }
    }, 3000);
}
