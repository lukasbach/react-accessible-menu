import * as React from 'react';
import { MenuProps } from './types';
import { useMemo } from 'react';
import { useMenu } from './useMenu';

export function Menu({
  renderMenu,
  ...listProps
}: MenuProps) {
  const { Provider, contextProps, renderProps } = useMenu(listProps);

  const content = useMemo(() => {
    return renderMenu(renderProps);
  }, [renderProps, renderMenu]);

  return <Provider value={contextProps}>{content}</Provider>;
}
