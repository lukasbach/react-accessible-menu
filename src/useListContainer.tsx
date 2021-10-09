import { useOrderedItems } from './useOrderedItems';
import { useRefCopy } from './useRefCopy';
import { memo, useCallback, useEffect, useMemo } from 'react';
import { ItemId, ListContextProps, ListOrientation, ListProps, ListType } from './types';
import { useListHotkeys } from './useListHotkeys';
import { ListContext } from './ListContext';
import * as React from 'react';


const NO_FOCUS = '__NO_FOCUS';

export const useListContainer = ({
 orientation = ListOrientation.Vertical,
 type = ListType.Menu,
 onFocusItem: onFocusItemHandler,
 onSelectItem: onSelectItemHandler,
 focusedItem: controlledFocusedItem,
 scrollToItem: scrollToItemHandler,
}: ListProps) => {
  const {
    items,
    reorder,
    getItem,
    registerItem,
    unregisterItem,
    updateItem,
    focusItem,
    focusedItem,
    moveFocusIndexRelative,
    moveFocusToStart,
    moveFocusToEnd,
    moveFocusToCharacter,
  } = useOrderedItems(scrollToItemHandler);

  const focusedItemRef = useRefCopy(focusedItem);

  useEffect(() => {
    if (controlledFocusedItem) {
      focusItem(controlledFocusedItem);
    }
  }, [focusItem, controlledFocusedItem]);

  const onSelectItem = useCallback<ListContextProps["onSelectItem"]>(id => {
    const item = getItem(id);
    if (item) {
      onSelectItemHandler?.(id, item.data);
      item.onSelectHandler?.();
    }
  }, [getItem, onSelectItemHandler]);

  const onFocusItem = useCallback<ListContextProps["onFocusItem"]>(id => {
    focusItem(id, true);
    if (onFocusItemHandler) {
      onFocusItemHandler(id, getItem(id));
    }
  }, [focusItem]);

  const contextProps = useMemo<ListContextProps>(() => ({
    type,
    registerItem,
    unregisterItem,
    updateItem,
    onSelectItem,
    focusedItem: focusedItem ?? NO_FOCUS,
    onFocusItem,
  }), [type, registerItem, unregisterItem, focusedItem, onFocusItem]);

  useListHotkeys(moveFocusIndexRelative, moveFocusToStart, moveFocusToEnd, moveFocusToCharacter, onSelectItem, focusedItemRef);

  const Provider: React.FC = useCallback(({ children }) => (
    <ListContext.Provider value={contextProps}>
      { children }
    </ListContext.Provider>
  ), []);

  console.log(items.current.length, items.current[0]?.id, items.current[items.current.length - 1]?.id, focusedItem);

  return {
    Provider,
    items,
    focusItem,
    focusedItem
  }
}