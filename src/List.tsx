import * as React from 'react';
import { ListProps } from './types';
import { PropsWithChildren } from 'react';
import { useListContainer } from './useListContainer';

export function List({
  children,
  ...listProps
}: PropsWithChildren<ListProps>) {
  const { Provider } = useListContainer(listProps);
  return <Provider>{children}</Provider>;
}
