import { MutableRefObject, useCallback, useMemo, useRef, useState } from 'react';
import { ItemId, ListContextProps, RegisteredItem } from './types';
import { sortItems } from './utils';
import { useRefCopy } from './useRefCopy';

const NO_FOCUS = '__NO_FOCUS';

export const useOrderedItems = (
  scrollToItem?: (id: ItemId, itemData: any) => void,
) => {
  const items = useRef<RegisteredItem[]>([]);
  const [focusedItem, setFocusedItem] = useState<ItemId | null>(null);
  const focusedItemRef = useRefCopy(focusedItem);

  const getItem = useCallback((id: ItemId) => {
    return items.current.find(item => item.id === id);
  }, []);

  const reorder = useCallback(() => {
    items.current = sortItems([...items.current]);
  }, []);

  const focusItem = useCallback((item: RegisteredItem, passive = false) => {
    if (focusedItemRef.current === item.id || item.disabled) { // TODO use focusitemref
      return;
    }

    setFocusedItem(item.id);

    if (!passive) {
      scrollToItem?.(item.id, item);
      item.node.focus();
    }
  }, [scrollToItem]);

  const focusItemById = useCallback((itemId: ItemId, passive = false) => {
    const item = getItem(itemId);
    if (item) {
      focusItem(item, passive);
    }
  }, [focusItem, getItem]);

  const registerItem = useCallback<ListContextProps["registerItem"]>((item) => {
    items.current.push(item);
    if (focusedItemRef.current === null) {
      focusItem(item, true);
    }
    reorder();
  }, [focusItem, reorder]);

  const unregisterItem = useCallback<ListContextProps["unregisterItem"]>((id) => {
    const index = items.current.findIndex(item => item.id === id);
    if (index >= 0) {
      items.current.splice(index, 1);
    }
    if (focusedItemRef.current === id) {
      focusItem(items.current[0] ?? null, true);
    }
  }, [focusItem]);

  const updateItem = useCallback<ListContextProps["updateItem"]>((id, item) => {
    const index = items.current.findIndex(item => item.id === id);
    if (index >= 0) {
      items.current[index] = { ...items.current[index], ...item };
    }
  }, []);

  const getFocusedItemIndex = useCallback(() => {
    return items.current.findIndex(item => item.id === focusedItemRef.current);
  }, []);

  const moveFocusIndex = useCallback((index: number) => {
    const newFocusItem = items.current[index];
    focusItem(newFocusItem);
  }, [focusItem]);

  const findNextFocusIndex = useCallback((start: number, direction: 'up' | 'down') => {
    const step = direction === 'up' ? -1 : 1;
    let index = start;
    const isValidNextIndex = () => !items.current[index]?.disabled;
    const isInBounds = () => index >= 0 && index < items.current.length;

    while (!isValidNextIndex() && isInBounds()) {
      index += step;
    }

    if(isInBounds()) {
      moveFocusIndex(index);
    }
  }, [moveFocusIndex]);

  const moveFocusIndexRelative = useCallback(
    (direction: 'up' | 'down') =>
      findNextFocusIndex(getFocusedItemIndex() + (direction === 'up' ? -1 : 1), direction),
    [getFocusedItemIndex, findNextFocusIndex]
  );

  const moveFocusToStart = useCallback(() =>
    findNextFocusIndex(0, 'down'), [findNextFocusIndex]);

  const moveFocusToEnd = useCallback(() =>
    findNextFocusIndex(items.current.length - 1, 'up'), [findNextFocusIndex]);

  const moveFocusToCharacter = useCallback((character: string) => {
    const key = character[0].toLowerCase();
    const item = items.current.find(item => item.searchLabel?.toLowerCase().startsWith(key));
    if (item) {
      focusItem(item);
    }
  }, []);

  return {
    focusItem: focusItemById,
    items,
    getItem,
    reorder,
    registerItem,
    unregisterItem,
    updateItem,
    focusedItem,
    getFocusedItemIndex,
    moveFocusIndex,
    moveFocusIndexRelative,
    moveFocusToStart,
    moveFocusToEnd,
    moveFocusToCharacter,
  }
};

export type MoveFocusHelpers = Pick<
  ReturnType<typeof useOrderedItems>,
  'moveFocusIndexRelative' | 'moveFocusToStart' | 'moveFocusToEnd'
>;