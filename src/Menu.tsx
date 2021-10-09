import * as React from 'react';
import { MenuProps } from './types';
import { useMemo } from 'react';
import { useMenu } from './useMenu';

export function Menu({
  renderMenu,
  ...menuProps
}: MenuProps) {
  const { Provider, contextProps, renderProps } = useMenu(menuProps);

  const content = useMemo(() => {
    return renderMenu(renderProps);
  }, [renderProps, renderMenu]);

  return <Provider value={contextProps}>{content}</Provider>;
}
