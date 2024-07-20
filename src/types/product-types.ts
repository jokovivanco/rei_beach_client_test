export type Product = {
  id: number;
  name: string;
  availability: boolean;
  price: number;
  created_at: Date;
  updated_at: Date;
  category_id: number;
  created_by: string;
};

export type Category = {
  id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
};

export type ProductResponse = {
  id: number;
  name: string;
  availability: boolean;
  price: number;
  created_at: Date;
  updated_at: Date;
};

export type ProductAndPopulatedCategoryResponse = ProductResponse & {
  category: Category;
};

export type CreateProductRequest = {
  name: string;
  availability: boolean;
  price: number;
  category_id: number;
};

export type SearchProductRequest = {
  name?: string;
  size: number;
  cursor?: number;
};

export function toProductResponse(product: Product): ProductResponse {
  return {
    id: product.id,
    name: product.name,
    availability: product.availability,
    price: product.price,
    created_at: product.created_at,
    updated_at: product.updated_at,
  };
}

export function toProductAndPopulatedCategoryResponse(
  product: Product & { category: Category },
): ProductAndPopulatedCategoryResponse {
  return Object.assign(toProductResponse(product), {
    category: product.category,
  });
}
