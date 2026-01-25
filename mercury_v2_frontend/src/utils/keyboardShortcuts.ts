import { useEffect, useCallback } from 'react';

type KeyHandler = (e: KeyboardEvent) => void;

interface ShortcutConfig {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  handler: () => void;
  preventDefault?: boolean;
}

/**
 * 키보드 단축키 훅
 */
export const useKeyboardShortcuts = (shortcuts: ShortcutConfig[]) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch = shortcut.ctrl ? e.ctrlKey || e.metaKey : !e.ctrlKey && !e.metaKey;
        const shiftMatch = shortcut.shift ? e.shiftKey : !e.shiftKey;
        const altMatch = shortcut.alt ? e.altKey : !e.altKey;
        const metaMatch = shortcut.meta ? e.metaKey : true;

        if (keyMatch && ctrlMatch && shiftMatch && altMatch && metaMatch) {
          if (shortcut.preventDefault !== false) {
            e.preventDefault();
          }
          shortcut.handler();
          break;
        }
      }
    },
    [shortcuts]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
};

/**
 * 캔버스 단축키 설정
 */
export const createCanvasShortcuts = (handlers: {
  onSelectTool: () => void;
  onHandTool: () => void;
  onBrushTool: () => void;
  onEraserTool: () => void;
  onShapeTool: () => void;
  onTextTool: () => void;
  onImageTool: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onDuplicate: () => void;
  onGroup: () => void;
  onUngroup: () => void;
  onDelete: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
}): ShortcutConfig[] => {
  return [
    // 도구 전환
    { key: 'v', handler: handlers.onSelectTool },
    { key: 'h', handler: handlers.onHandTool },
    { key: 'b', handler: handlers.onBrushTool },
    { key: 'e', handler: handlers.onEraserTool },
    { key: 'r', handler: handlers.onShapeTool },
    { key: 't', handler: handlers.onTextTool },
    { key: 'i', handler: handlers.onImageTool },

    // 액션
    { key: 'z', ctrl: true, handler: handlers.onUndo },
    { key: 'z', ctrl: true, shift: true, handler: handlers.onRedo },
    { key: 'd', ctrl: true, handler: handlers.onDuplicate },
    { key: 'g', ctrl: true, handler: handlers.onGroup },
    { key: 'g', ctrl: true, shift: true, handler: handlers.onUngroup },
    { key: 'Delete', handler: handlers.onDelete },
    { key: 'Backspace', handler: handlers.onDelete },

    // 줌
    { key: '=', ctrl: true, handler: handlers.onZoomIn },
    { key: '+', ctrl: true, handler: handlers.onZoomIn },
    { key: '-', ctrl: true, handler: handlers.onZoomOut },
    { key: '0', shift: true, handler: handlers.onResetZoom },
  ];
};
