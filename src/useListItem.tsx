import { ListItemProps, ListItemRenderProps, UseListItemProps } from './types';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { ListContext } from './ListContext';

export const useListItem = <E extends HTMLElement = HTMLDivElement, D = any | undefined>({
  id: defaultId,
  data,
  searchLabel,
  onSelect,
  disabled,
  updateSearchLabelDeps,
  autoFocus, // TODO
}: UseListItemProps<E, D>) => {
  const [id] = useState(defaultId ?? uuid());
  const childRef = useRef<E>(null);
  const { unregisterItem, registerItem, updateItem, focusedItem, onFocusItem, onSelectItem } = useContext(ListContext);

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

  const renderProps = useMemo<ListItemRenderProps<E, D>>(() => ({
    id,
    data,
    ref: childRef,
    props: {
      tabIndex: focusedItem === id ? 0 : -1,
      role: 'menuitem', // TODO
      onFocus: e => {
        onFocusItem(id);
      },
      onClick: e => {
        onSelectItem(id);
      },
    }
  }), [id, data, onFocusItem]);

  useEffect(() => {
    if (!searchLabel) {
      const searchLabel = childRef.current?.innerHTML;
      if (searchLabel) {
        updateItem(id, { searchLabel });
      }
    }
  }, [renderProps, ...updateSearchLabelDeps ?? []]);

  return {
    renderProps,
  }
}