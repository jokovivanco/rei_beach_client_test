export type Category = {
  id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
};

export type CategoryResponse = {
  id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
};

export type CategoryAndPopulatedItemsResponse = CategoryResponse & {
  _count: { items: number };
};

export type CreateCategoryRequest = {
  name: string;
};

export type SearchCategoryRequest = {
  name?: string;
  page?: number;
  size?: number;
};

export type UpdateCategoryRequest = {
  id: number;
  name?: string;
};
