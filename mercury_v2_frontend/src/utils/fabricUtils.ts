import * as fabric from 'fabric';
import type { CanvasLayer, LayerType } from '../types/api/canvas';

/**
 * 서버 레이어 데이터를 Fabric.js 객체로 변환
 */
export const layerDataToFabricObject = (
  layer: CanvasLayer
): fabric.Object | null => {
  const { layer_type, layer_data, opacity = 1, is_locked = false } = layer;

  let fabricObject: fabric.Object | null = null;

  switch (layer_type) {
    case 'sketch':
      // SVG Path로 스케치 복원
      if (layer_data.paths && Array.isArray(layer_data.paths)) {
        const group = new fabric.Group();
        layer_data.paths.forEach((pathData: any) => {
          const path = new fabric.Path(pathData.d, {
            stroke: pathData.stroke || '#000000',
            strokeWidth: pathData['stroke-width'] || 2,
            fill: 'transparent',
          });
          group.add(path);
        });
        fabricObject = group;
      }
      break;

    case 'image':
    case 'generated':
      // 이미지 URL로부터 이미지 객체 생성
      if (layer_data.image_url) {
        // 비동기 로딩이 필요하므로 별도 함수 사용 권장
        // 여기서는 placeholder 반환
        fabricObject = new fabric.Rect({
          width: layer_data.width || 200,
          height: layer_data.height || 200,
          fill: '#e2e8f0',
        });
      }
      break;

    case 'shape':
      if (layer_data.shape === 'rect') {
        fabricObject = new fabric.Rect({
          width: layer_data.width || 100,
          height: layer_data.height || 100,
          fill: layer_data.fill || '#3b82f6',
          stroke: layer_data.stroke,
          strokeWidth: layer_data.strokeWidth || 0,
        });
      } else if (layer_data.shape === 'circle') {
        fabricObject = new fabric.Circle({
          radius: layer_data.radius || 50,
          fill: layer_data.fill || '#3b82f6',
          stroke: layer_data.stroke,
          strokeWidth: layer_data.strokeWidth || 0,
        });
      }
      break;

    case 'text':
      fabricObject = new fabric.IText(layer_data.text || 'Text', {
        fontSize: layer_data.fontSize || 20,
        fontFamily: layer_data.fontFamily || 'Arial',
        fill: layer_data.fill || '#000000',
      });
      break;

    default:
      break;
  }

  if (fabricObject) {
    // 공통 속성 설정
    fabricObject.set({
      left: layer_data.x || layer_data.left || 0,
      top: layer_data.y || layer_data.top || 0,
      opacity: opacity,
      selectable: !is_locked,
      evented: !is_locked,
    });

    // 레이어 ID를 Fabric 객체에 저장
    (fabricObject as any).layerId = layer.id;
    (fabricObject as any).layerType = layer_type;
  }

  return fabricObject;
};

/**
 * Fabric.js 객체를 서버 레이어 데이터로 변환
 */
export const fabricObjectToLayerData = (
  fabricObject: fabric.Object,
  layerType?: LayerType
): Record<string, any> => {
  const baseData = {
    x: fabricObject.left || 0,
    y: fabricObject.top || 0,
    width: fabricObject.width || 0,
    height: fabricObject.height || 0,
    scaleX: fabricObject.scaleX || 1,
    scaleY: fabricObject.scaleY || 1,
    angle: fabricObject.angle || 0,
  };

  // 타입별 추가 데이터
  if (fabricObject instanceof fabric.Path) {
    return {
      ...baseData,
      d: (fabricObject as any).path,
      stroke: fabricObject.stroke,
      'stroke-width': fabricObject.strokeWidth,
    };
  } else if (fabricObject instanceof fabric.Image) {
    return {
      ...baseData,
      image_url: (fabricObject as any).getSrc(),
    };
  } else if (fabricObject instanceof fabric.Rect) {
    return {
      ...baseData,
      shape: 'rect',
      fill: fabricObject.fill,
      stroke: fabricObject.stroke,
      strokeWidth: fabricObject.strokeWidth,
    };
  } else if (fabricObject instanceof fabric.Circle) {
    return {
      ...baseData,
      shape: 'circle',
      radius: (fabricObject as any).radius,
      fill: fabricObject.fill,
      stroke: fabricObject.stroke,
      strokeWidth: fabricObject.strokeWidth,
    };
  } else if (fabricObject instanceof fabric.IText || fabricObject instanceof fabric.Text) {
    return {
      ...baseData,
      text: (fabricObject as any).text,
      fontSize: (fabricObject as any).fontSize,
      fontFamily: (fabricObject as any).fontFamily,
      fill: fabricObject.fill,
    };
  }

  return baseData;
};

/**
 * 이미지 URL로부터 Fabric Image 객체 생성 (비동기)
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
 * 캔버스를 이미지로 내보내기
 */
export const exportCanvasToImage = (
  canvas: fabric.Canvas,
  format: 'png' | 'jpeg' = 'png',
  quality = 1
): string => {
  return canvas.toDataURL({
    format,
    quality,
    multiplier: 1,
  });
};

/**
 * SVG Path를 마스크 이미지로 변환
 */
export const createMaskFromPath = (
  paths: any[],
  width: number,
  height: number
): string => {
  // 임시 캔버스 생성
  const tempCanvas = new fabric.Canvas(null as any, { width, height });

  paths.forEach((pathData) => {
    const path = new fabric.Path(pathData.d || pathData, {
      fill: '#FFFFFF',
      stroke: null,
    });
    tempCanvas.add(path);
  });

  const dataUrl = tempCanvas.toDataURL({
    multiplier: 1,
    format: 'png',
    quality: 1,
  });

  tempCanvas.dispose();
  return dataUrl;
};

/**
 * Fabric 객체에서 바운딩 박스 추출
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
