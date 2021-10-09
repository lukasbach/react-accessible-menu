import { useDocumentEvent } from './useDocumentEvent';
import { useOrderedItems } from './useOrderedItems';
import { ItemId, ListContextProps } from './types';
import { MutableRefObject } from 'react';

const interactiveElements = ["textarea", "input"];

export const useListHotkeys = (
  moveFocusIndexRelative: ReturnType<typeof useOrderedItems>["moveFocusIndexRelative"],
  moveFocusToStart: ReturnType<typeof useOrderedItems>["moveFocusToStart"],
  moveFocusToEnd: ReturnType<typeof useOrderedItems>["moveFocusToEnd"],
  moveFocusToCharacter: ReturnType<typeof useOrderedItems>["moveFocusToCharacter"],
  onSelectItem: ListContextProps["onSelectItem"],
  focusedItemRef: MutableRefObject<ItemId | null>,
) => {
  useDocumentEvent('keydown', e => {
    if (interactiveElements.includes((e.target as HTMLElement).tagName.toLowerCase())) {
      return;
    }
    // TODO ignore if focus item is not within list

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
    } else if (/^[a-zA-Z0-9]$/.test(e.key)) {
      e.preventDefault();
      e.stopPropagation();
      moveFocusToCharacter(e.key);
    }
  }, [moveFocusIndexRelative, moveFocusToStart, moveFocusToEnd]);
};
