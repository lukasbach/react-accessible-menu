import { HTMLAttributes, HTMLProps, ReactElement, ReactNode, RefObject } from 'react';

export type ItemId = string | number;

export interface ListRefInterface<T = any | undefined> {
  focusItem: (id: ItemId) => void;
  triggerOrderRecalculation: () => void;
}

export interface ListProps<T = any | undefined> {
  type?: ListType,
  orientation?: ListOrientation,
  onSelectItem?: (id: ItemId, itemData: T) => void;
  onFocusItem?: (id: ItemId, itemData: T) => void;
  focusedItem?: ItemId;
  children?: ReactNode | undefined;
}

export enum ListType {
  List = 'list',
  Menu = 'menu',
}

export enum ListOrientation {
  Vertical = 'vertical',
  Horizontal = 'horizontal',
}

export interface ListItemProps<E extends HTMLElement = HTMLDivElement, D = any | undefined> {
  id?: ItemId;
  data?: D;
  renderItem: (props: ListItemRenderProps<E, D>) => ReactElement | null;
  onSelect?: () => void;
  autoFocus?: boolean;
  disabled?: boolean;
  searchLabel?: string;
}

export interface ListItemRenderProps<E extends HTMLElement, T> {
  id: ItemId;
  data?: T;
  props: HTMLAttributes<E>;
  ref: RefObject<E>;
}

export interface ListContextProps {
  registerItem: (item: RegisteredItem) => void;
  unregisterItem: (id: ItemId) => void;
  updateItem: (id: ItemId, item: Partial<Omit<RegisteredItem, 'id'>>) => void;
  type: ListType;
  focusedItem: ItemId;
  onFocusItem: (id: ItemId) => void;
  onSelectItem: (id: ItemId) => void;
}

export interface RegisteredItem {
  id: ItemId;
  data: any;
  node: HTMLElement;
  disabled?: boolean;
  onSelectHandler?: () => void;
  searchLabel?: string;
}