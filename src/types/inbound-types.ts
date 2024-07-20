import { Item } from './item-types';

export type InboundResponse = {
  id: number;
  sku?: string | null;
  quantity: number;
  price: number;
  issued_at: Date;
  created_at: Date;
  updated_at: Date;
};

export type InboundAndPopulatedItemResponse = InboundResponse & {
  item: Item;
};

export type CreateInboundRequest = {
  quantity: number;
  price: number;
  issued_at: Date;
  itemId: number;
};

export type SearchInboundRequest = {
  name?: string;
  sku?: string;
  page?: number;
  size?: number;
};

export type UpdateInboundRequest = {
  id: number;
  itemId: number;
  quantity?: number;
  price?: number;
  issued_at?: Date;
};
