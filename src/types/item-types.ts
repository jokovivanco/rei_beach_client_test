import { Category } from './category-types';

export type Item = {
  id: number;
  sku: string | null;
  name: string;
  quantity: number;
  unit: string;
  notes: string | null;
  created_at: Date;
  updated_at: Date;
  categoryId: number;
  deleted: boolean;
  username: string;
};

export type ItemResponse = {
  id: number;
  sku?: string | null;
  name: string;
  quantity: number;
  unit: string;
  notes?: string | null;
  deleted: boolean;
  created_at: Date;
  updated_at: Date;
};

export type ItemAndPopulatedCategoryResponse = ItemResponse & {
  category: Category;
};

export type CreateItemRequest = {
  name: string;
  categoryId: number;
  quantity?: number;
  unit?: string;
  notes?: string | null;
};

export type SearchItemRequest = {
  name?: string;
  sku?: string;
  category?: string;
  page?: number;
  size?: number;
};

export type UpdateItemRequest = {
  id: number;
  name?: string;
  quantity?: number;
  categoryId: number;
  unit?: string;
  notes?: string | null;
};
