import * as React from 'react';
import { ListContext } from './ListContext';
import { ItemId, ListContextProps, ListOrientation, ListProps, ListType, RegisteredItem } from './types';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDocumentEvent } from './useDocumentEvent';
import { useOrderedItems } from './useOrderedItems';
import { useRefCopy } from './useRefCopy';
import { useListHotkeys } from './useListHotkeys';

const NO_FOCUS = '__NO_FOCUS';

const interactiveElements = ["textarea", "input"];

export function List({
  children,
  orientation = ListOrientation.Vertical,
  type = ListType.Menu,
  onFocusItem: onFocusItemHandler,
  onSelectItem: onSelectItemHandler,
  focusedItem: controlledFocusedItem,
}: ListProps) {
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
  } = useOrderedItems();

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

  const onFocusItem = useCallback<ListContextProps["onFocusItem"]>(id => focusItem(id, true), [focusItem]);

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

  return (
    <ListContext.Provider value={contextProps}>
      { children }
    </ListContext.Provider>
  )
}
