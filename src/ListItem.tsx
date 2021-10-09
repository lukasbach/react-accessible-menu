import * as React from 'react';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ListItemProps, ListItemRenderProps } from './types';
import { v4 as uuid } from 'uuid';
import { ListContext } from './ListContext';

export const LIST_ITEM_ID_DATA_ATTRIBUTE = 'data-ral-item';

export function ListItem<E extends HTMLElement = HTMLDivElement, D = any | undefined>({
  id: defaultId,
  data,
  searchLabel,
  renderItem,
  onSelect,
  disabled,
  autoFocus, // TODO
}: ListItemProps<E, D>) {
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

  useEffect(() => console.log("change onFocus"), [onFocusItem])

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
      ...({
        [LIST_ITEM_ID_DATA_ATTRIBUTE]: id
      } as any),
    }
  }), [id, data, onFocusItem]);

  const content = useMemo(() => {
    console.log("Rerender", (renderItem(renderProps) as any)?.ref?.current?.innerHTML)
    return renderItem(renderProps);
  }, [renderProps, renderItem]);

  useEffect(() => {
    if (!searchLabel) {
      const { innerHTML } = ((content as any)?.ref.current as HTMLElement);
      updateItem(id, { searchLabel: innerHTML });
    }
  }, [content, searchLabel]);

  return content;
}
