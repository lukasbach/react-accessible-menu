import { useOrderedItems } from './useOrderedItems';
import { useRefCopy } from './useRefCopy';
import { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { ItemId, ListContextProps, ListOrientation, ListProps, ListRenderProps, ListType, UseListProps } from './types';
import { useListHotkeys } from './useListHotkeys';
import { ListContext } from './ListContext';
import * as React from 'react';


const NO_FOCUS = '__NO_FOCUS';

export const useList = <E extends HTMLElement = HTMLDivElement, D = any | undefined>({
 orientation = ListOrientation.Vertical,
 type = ListType.Menu,
 onFocusItem: onFocusItemHandler,
 onSelectItem: onSelectItemHandler,
 focusedItem: controlledFocusedItem,
 scrollToItem: scrollToItemHandler,
}: UseListProps<E, D>) => {
  const listRef = useRef<E>(null);

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
      onFocusItemHandler(id, getItem(id)?.data);
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

  useListHotkeys(moveFocusIndexRelative, moveFocusToStart, moveFocusToEnd, moveFocusToCharacter, onSelectItem, focusedItemRef, listRef);

  const renderProps = useMemo<ListRenderProps<E, D>>(() => ({
    ref: listRef,
    props: {

    }
  }), []);

  return {
    Provider: ListContext.Provider,
    contextProps,
    items,
    focusItem,
    focusedItem,
    renderProps
  }
}