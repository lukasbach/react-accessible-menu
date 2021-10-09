import * as React from 'react';
import { ListProps } from './types';
import { PropsWithChildren, useMemo } from 'react';
import { useList } from './useList';

export function List({
  renderList,
  ...listProps
}: ListProps) {
  const { Provider, contextProps, renderProps } = useList(listProps);

  const content = useMemo(() => {
    return renderList(renderProps);
  }, [renderProps, renderList]);

  return <Provider value={contextProps}>{content}</Provider>;
}
