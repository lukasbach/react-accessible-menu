import * as React from 'react';
import { useMemo } from 'react';
import { ListItemProps } from './types';
import { useListItem } from './useListItem';

export function ListItem<E extends HTMLElement = HTMLDivElement, D = any | undefined>({
  renderItem,
  ...listItemProps
}: ListItemProps<E, D>) {
  const { renderProps } = useListItem<E, D>({
    ...listItemProps,
    updateSearchLabelDeps: [renderItem]
  });

  return useMemo(() => {
    return renderItem(renderProps);
  }, [renderProps, renderItem]);
}
