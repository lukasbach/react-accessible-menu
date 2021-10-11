import { useOrderedItems } from './useOrderedItems';
import { useRefCopy } from './useRefCopy';
import { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { ItemId, MenuContextProps, MenuOrientation, MenuProps, MenuRenderProps, MenuItemType, UseMenuProps } from './types';
import { useMenuHotkeys } from './useMenuHotkeys';
import { MenuContext } from './MenuContext';
import * as React from 'react';

const NO_FOCUS = '__NO_FOCUS';

export const useMenu = <E extends HTMLElement = HTMLDivElement, D = any | undefined>({
 orientation = MenuOrientation.Vertical,
 type = MenuItemType.Menu,
 onFocusItem: onFocusItemHandler,
 onSelectItem: onSelectItemHandler,
 focusedItem: controlledFocusedItem,
 scrollToItem: scrollToItemHandler,
 onKeyDown,
}: UseMenuProps<E, D>) => {
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

  const onSelectItem = useCallback<MenuContextProps["onSelectItem"]>(id => {
    const item = getItem(id);
    if (item) {
      onSelectItemHandler?.(id, item.data);
      item.onSelectHandler?.();
    }
  }, [getItem, onSelectItemHandler]);

  const onFocusItem = useCallback<MenuContextProps["onFocusItem"]>((id, passive = true) => {
    focusItem(id, passive);
    if (onFocusItemHandler) {
      onFocusItemHandler(id, getItem(id)?.data);
    }
  }, [focusItem]);

  const contextProps = useMemo<MenuContextProps>(() => ({
    type,
    registerItem,
    unregisterItem,
    updateItem,
    onSelectItem,
    focusedItem: focusedItem ?? NO_FOCUS,
    onFocusItem,
  }), [type, registerItem, unregisterItem, focusedItem, onFocusItem]);

  useMenuHotkeys(moveFocusIndexRelative, moveFocusToStart, moveFocusToEnd, moveFocusToCharacter, onSelectItem, focusedItemRef, onKeyDown, listRef);

  const renderProps = useMemo<MenuRenderProps<E, D>>(() => ({
    ref: listRef,
    props: {
      role: 'menu',
      tabIndex: -1,
      ['aria-orientation']: orientation,
    }
  }), []);

  return {
    Provider: MenuContext.Provider,
    contextProps,
    items,
    focusItem,
    focusedItem,
    renderProps,
    getItem,
    moveFocusIndexRelative,
    moveFocusToStart,
    moveFocusToEnd,
    moveFocusToCharacter,
    reorder,
  };
}