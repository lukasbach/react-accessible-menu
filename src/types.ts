import { HTMLAttributes, HTMLProps, ReactElement, ReactNode, RefObject } from 'react';

export type ItemId = string | number;

export interface MenuImperativeHandle<T = any | undefined> { // TODO
  focusItem: (id: ItemId) => void;
  reorder: () => void;
  focusedItem: ItemId | null;
}

export interface MenuProps<E extends HTMLElement = HTMLDivElement, D = any | undefined> {
  type?: MenuItemType,
  orientation?: MenuOrientation,
  onSelectItem?: (id: ItemId, itemData: D) => void;
  onFocusItem?: (id: ItemId, itemData: D) => void;
  onKeyDown?: (e: KeyboardEvent) => void,
  focusedItem?: ItemId;
  scrollToItem?: (id: ItemId, itemData: D) => void;
  renderMenu: (props: MenuRenderProps<E, D>) => ReactElement | null;
}

export interface MenuRenderProps<E extends HTMLElement = HTMLDivElement, D = any | undefined> {
  props: HTMLAttributes<E>;
  ref: RefObject<E>;
}

export interface UseMenuProps<E extends HTMLElement = HTMLDivElement, D = any | undefined> extends Omit<MenuProps<E, D>, "renderMenu"> {
}

export enum MenuItemType {
  Menu = 'menu',
  Radio = 'radio',
  Checkbox = 'checkbox',
}

export enum MenuOrientation {
  Vertical = 'vertical',
  Horizontal = 'horizontal',
}

export interface MenuItemProps<E extends HTMLElement = HTMLDivElement, D = any | undefined> {
  id?: ItemId;
  data?: D;
  renderItem: (props: MenuItemRenderProps<E, D>) => ReactElement | null;
  onSelect?: () => void;
  autoFocus?: boolean;
  disabled?: boolean;
  searchLabel?: string;
  type?: MenuItemType;
}

export interface UseMenuItemProps<E extends HTMLElement = HTMLDivElement, D = any | undefined> extends Omit<MenuItemProps<E, D>, "renderItem"> {
  updateSearchLabelDeps?: any[];
}

export interface MenuItemRenderProps<E extends HTMLElement, T> {
  id: ItemId;
  data?: T;
  props: HTMLAttributes<E>;
  ref: RefObject<E>;
}

export interface MenuContextProps {
  registerItem: (item: RegisteredItem) => void;
  unregisterItem: (id: ItemId) => void;
  updateItem: (id: ItemId, item: Partial<Omit<RegisteredItem, 'id'>>) => void;
  type: MenuItemType;
  focusedItem: ItemId;
  onFocusItem: (id: ItemId, passive?: boolean) => void;
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