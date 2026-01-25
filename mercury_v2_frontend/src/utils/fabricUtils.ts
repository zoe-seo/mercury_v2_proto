import * as fabric from 'fabric';
import type { CanvasLayer, LayerType, SketchLayerData, ImageLayerData, TextLayerData } from '../types/api/canvas';

/**
 * Convert server layer data to Fabric.js object
 */
export const layerDataToFabricObject = (
  layer: CanvasLayer
): fabric.Object | null => {
  const { layer_type, layer_data, opacity = 1, is_locked = false } = layer;

  let fabricObject: fabric.Object | null = null;

  // 1. Try to load from fabric_json if available (most accurate)
  if (layer_data.fabric_json) {
    // Note: This is synchronous in fabric v5/v6 if using correct method, 
    // but fabric.util.enlivenObjects is async.
    // For simplicity in this sync function, we skip complex hydration here 
    // or assume simple object creation if JSON not available.
    // However, since this function is synchronous, we fallback to manual creation below.
    // Ideally, we should use loadFromJSON async.
  }

  switch (layer_type) {
    case 'sketch': {
      const data = layer_data as SketchLayerData;
      // If paths exist, create a Group of paths
      if (data.paths && data.paths.length > 0) {
        const paths = data.paths.map((pathData: any) => {
          return new fabric.Path(pathData.d, {
            stroke: pathData.stroke || '#000000',
            strokeWidth: pathData['stroke-width'] || 2,
            fill: 'transparent',
            strokeDashArray: pathData.strokeDashArray,
          });
        });

        fabricObject = new fabric.Group(paths, {
          left: data.x || 0,
          top: data.y || 0,
          width: data.width,
          height: data.height,
        });
      } else {
        // Empty sketch layer -> Create the Frame (Dashed Rect)
        fabricObject = new fabric.Rect({
          left: data.x || 0,
          top: data.y || 0,
          width: data.width || 768,
          height: data.height || 768,
          fill: '#ffffff',
          stroke: '#D4D4D4',
          strokeWidth: 2,
          strokeDashArray: [10, 10],
          selectable: true,
        });
        // Optional: Add styling details like 'Pencil Icon' here if we used a Group
      }
      break;
    }

    case 'image': {
      const data = layer_data as ImageLayerData;
      // Image should be loaded async via utils, 
      // here we return a placeholder if image_url exists, 
      // actual loading happens in effect in CanvasPage
      if (data.image_url) {
        // Placeholder rect while loading
        fabricObject = new fabric.Rect({
          left: data.x,
          top: data.y,
          width: data.width,
          height: data.height,
          fill: '#f3f4f6', // Gray-100
          stroke: '#e5e7eb', // Gray-200
        });
      }
      break;
    }

    case 'text': {
      const data = layer_data as TextLayerData;
      fabricObject = new fabric.IText(data.text || 'Text', {
        left: data.x,
        top: data.y,
        fontSize: data.font_size || 20,
        fontFamily: data.font_family || 'Inter',
        fill: data.fill || '#000000',
      });
      break;
    }
  }

  if (fabricObject) {
    // Common properties
    fabricObject.set({
      opacity: opacity,
      selectable: !is_locked,
      evented: !is_locked,
    });
    
    // Check if properties from layer_data override common ones (like x/y moved to specific cases above, but double check)
    // Actually fabricObject creation above sets left/top.
    
    // Store Metadata
    (fabricObject as any).layerId = layer.id;
    (fabricObject as any).layerType = layer_type;
  }

  return fabricObject;
};

/**
 * Convert Fabric.js object to server layer data format
 */
export const fabricObjectToLayerData = (
  fabricObject: fabric.Object
): Record<string, any> => {
  const layerType = (fabricObject as any).layerType as LayerType;
  
  const baseData = {
    x: fabricObject.left || 0,
    y: fabricObject.top || 0,
    width: fabricObject.getScaledWidth(),
    height: fabricObject.getScaledHeight(),
    scale_x: fabricObject.scaleX || 1,
    scale_y: fabricObject.scaleY || 1,
    rotation: fabricObject.angle || 0,
  };

  if (!layerType) return baseData;

  switch (layerType) {
    case 'text': {
       const textObj = fabricObject as fabric.IText;
       return {
         ...baseData,
         text: textObj.text,
         font_size: textObj.fontSize,
         font_family: textObj.fontFamily,
         fill: textObj.fill,
       };
    }
    case 'sketch': {
      // if it's a group, extract paths?
      // For now, assuming we save paths if simplified
      return {
        ...baseData,
        // paths: ... extraction logic complex for Group
      };
    }
    case 'image': {
      const imgObj = fabricObject as fabric.Image;
      return {
        ...baseData,
        image_url: imgObj.getSrc(),
      };
    }
    default:
      return baseData;
  }
};

/**
 * Load Image from URL Async
 */
export const loadImageFromUrl = async(
  url: string,
  options?: any
): Promise<fabric.Image> => {
  const img = await fabric.Image.fromURL(url, {
    crossOrigin: 'anonymous',
  });

  if (options) {
    img.set(options);
  }

  return img;
};

/**
 * Extract bounds
 */
export const getObjectBounds = (obj: fabric.Object) => {
  const bounds = obj.getBoundingRect();
  return {
    left: bounds.left,
    top: bounds.top,
    width: bounds.width,
    height: bounds.height,
  };
};
