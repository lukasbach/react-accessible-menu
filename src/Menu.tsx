import * as React from 'react';
import { MenuImperativeHandle, MenuProps } from './types';
import { forwardRef, useImperativeHandle, useMemo } from 'react';
import { useMenu } from './useMenu';

export const Menu = forwardRef<MenuImperativeHandle, MenuProps>((
  { renderMenu, ...menuProps },
  ref
) => {
  const { Provider, contextProps, renderProps, reorder, focusedItem, focusItem } = useMenu(menuProps);

  useImperativeHandle<{}, MenuImperativeHandle>(ref, () => ({
    reorder,
    focusedItem,
    focusItem
  }), [reorder, focusedItem, focusItem]);

  const content = useMemo(() => {
    return renderMenu(renderProps);
  }, [renderProps, renderMenu]);

  return <Provider value={contextProps}>{content}</Provider>;
})
