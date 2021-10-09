import { HTMLAttributes, HTMLProps, ReactElement, ReactNode, RefObject } from 'react';

export type ItemId = string | number;

export interface ListRefInterface<T = any | undefined> {
  focusItem: (id: ItemId) => void;
  triggerOrderRecalculation: () => void;
}

export interface ListProps<E extends HTMLElement = HTMLDivElement, D = any | undefined> {
  type?: ListType,
  orientation?: ListOrientation,
  onSelectItem?: (id: ItemId, itemData: D) => void;
  onFocusItem?: (id: ItemId, itemData: D) => void;
  focusedItem?: ItemId;
  scrollToItem?: (id: ItemId, itemData: D) => void;
  renderList: (props: ListRenderProps<E, D>) => ReactElement | null;
}

export interface ListRenderProps<E extends HTMLElement = HTMLDivElement, D = any | undefined> {
  props: HTMLAttributes<E>;
  ref: RefObject<E>;
}

export interface UseListProps<E extends HTMLElement = HTMLDivElement, D = any | undefined> extends Omit<ListProps<E, D>, "renderList"> {
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

export interface UseListItemProps<E extends HTMLElement = HTMLDivElement, D = any | undefined> extends Omit<ListItemProps<E, D>, "renderItem"> {
  updateSearchLabelDeps?: any[];
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