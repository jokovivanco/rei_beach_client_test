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

export type CategoryAndPopulatedProductsResponse = CategoryResponse & {
  _count: { products: number };
};

export type CreateCategoryRequest = {
  name: string;
};

export type SearchCategoryRequest = {
  name?: string;
  size: number;
  cursor?: number;
};

export type UpdateCategoryRequest = {
  id: number;
  name?: string;
};
