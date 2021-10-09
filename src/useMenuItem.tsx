import { MenuItemRenderProps, MenuItemType, UseMenuItemProps } from './types';
import { useEffect, useMemo, useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { useMenuContext } from './useMenuContext';

const roles = {
  [MenuItemType.Menu]: 'menuitem',
  [MenuItemType.Radio]: 'menuitemradio',
  [MenuItemType.Checkbox]: 'menuitemcheckbox',
};

export const useMenuItem = <E extends HTMLElement = HTMLDivElement, D = any | undefined>({
  id: defaultId,
  data,
  searchLabel,
  onSelect,
  disabled,
  updateSearchLabelDeps,
  autoFocus,
  type: itemType,
}: UseMenuItemProps<E, D>) => {
  const [id] = useState(defaultId ?? uuid());
  const childRef = useRef<E>(null);
  const { unregisterItem, registerItem, updateItem, focusedItem, onFocusItem, onSelectItem, type: menuType } = useMenuContext();
  const hasFocus = focusedItem === id;
  const menuItemType = itemType ?? menuType ?? MenuItemType.Menu;

  useEffect(() => {
    if (childRef.current !== null) {
      registerItem({
        id,
        data,
        disabled,
        searchLabel,
        node: childRef.current,
        onSelectHandler: onSelect,
      });
      return () => unregisterItem(id);
    }
    return undefined;
  }, [id, childRef]);

  useEffect(() => {
    updateItem(id, {
      data,
      disabled,
      onSelectHandler: onSelect,
      ...(searchLabel ? { searchLabel } : {}),
    });
  }, [disabled, onSelect, data, searchLabel]);

  const renderProps = useMemo<MenuItemRenderProps<E, D>>(() => ({
    id,
    data,
    ref: childRef,
    props: {
      tabIndex: hasFocus ? 0 : -1,
      role: roles[menuItemType],
      onFocus: e => {
        onFocusItem(id);
      },
      onClick: e => {
        onSelectItem(id);
      },
    }
  }), [id, data, onFocusItem, hasFocus]);

  useEffect(() => {
    if (!searchLabel) {
      const searchLabel = childRef.current?.innerHTML;
      if (searchLabel) {
        updateItem(id, { searchLabel });
      }
    }
  }, [renderProps, ...updateSearchLabelDeps ?? []]);

  useEffect(() => {
    if (autoFocus) {
      onFocusItem(id, false);
    }
  }, []);

  return {
    id,
    hasFocus,
    renderProps,
  };
}