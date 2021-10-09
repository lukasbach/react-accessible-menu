import { createContext } from 'react';
import { ListContextProps, ListType } from './types';


export const ListContext = createContext<ListContextProps>({
  registerItem: () => {},
  unregisterItem: () => {},
  onFocusItem: () => {},
  type: ListType.List,
  focusedItem: -1,
});