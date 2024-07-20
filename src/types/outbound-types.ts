import { Item } from './item-types';

export type OutboundResponse = {
  id: number;
  sku?: string | null;
  quantity: number;
  issued_at: Date;
  created_at: Date;
  updated_at: Date;
};

export type OutboundAndPopulatedItemResponse = OutboundResponse & {
  item: Item;
};

export type CreateOutboundRequest = {
  quantity: number;
  issued_at: Date;
  itemId: number;
};

export type SearchOutboundRequest = {
  name?: string;
  sku?: string;
  page: number;
  size: number;
};

export type UpdateOutboundRequest = {
  id: number;
  itemId: number;
  quantity?: number;
  issued_at?: Date;
};
