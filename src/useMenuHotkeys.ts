import { useOrderedItems } from './useOrderedItems';
import { ItemId, MenuContextProps } from './types';
import { MutableRefObject, useCallback, useEffect } from 'react';

const interactiveElements = ["textarea", "input"];

export const useMenuHotkeys = <T extends HTMLElement>(
  moveFocusIndexRelative: ReturnType<typeof useOrderedItems>["moveFocusIndexRelative"],
  moveFocusToStart: ReturnType<typeof useOrderedItems>["moveFocusToStart"],
  moveFocusToEnd: ReturnType<typeof useOrderedItems>["moveFocusToEnd"],
  moveFocusToCharacter: ReturnType<typeof useOrderedItems>["moveFocusToCharacter"],
  onSelectItem: MenuContextProps["onSelectItem"],
  focusedItemRef: MutableRefObject<ItemId | null>,
  onKeyDown: ((event: KeyboardEvent) => void) | undefined,
  containerRef: MutableRefObject<T | null>,
  ignoreSearchByKey = false,
) => {
  const event = useCallback((e: KeyboardEvent) => {
    if (interactiveElements.includes((e.target as HTMLElement).tagName.toLowerCase())) {
      return;
    }

    if (!containerRef.current || !containerRef.current?.contains(document.activeElement)) {
      return;
    }

    onKeyDown?.(e);

    if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      e.stopPropagation();
      moveFocusIndexRelative("up");
    } else if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      e.stopPropagation();
      moveFocusIndexRelative("down");
    } else if (e.key === "Home") {
      e.preventDefault();
      e.stopPropagation();
      moveFocusToStart();
    } else if (e.key === "End") {
      e.preventDefault();
      e.stopPropagation();
      moveFocusToEnd();
    } else if (e.key === "Enter" || e.key === " ") {
      if (focusedItemRef.current) {
        e.preventDefault();
        e.stopPropagation();
        onSelectItem(focusedItemRef.current);
      }
    } else if (/^[a-zA-Z0-9]$/.test(e.key) && !ignoreSearchByKey) {
      e.preventDefault();
      e.stopPropagation();
      moveFocusToCharacter(e.key);
    }
  }, [moveFocusIndexRelative, moveFocusToStart, moveFocusToEnd, onKeyDown, ignoreSearchByKey]);

  useEffect(() => {
    containerRef.current?.addEventListener('keydown', event);
    return () => containerRef.current?.removeEventListener('keydown', event);
  }, [event]);
};
