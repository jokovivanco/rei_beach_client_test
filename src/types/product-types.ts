type Product = {
  id: number;
  name: string;
  availability: boolean;
  price: number;
  capital_price: number;
  image_url: string | null;
  image_hash: string | null;
  created_at: Date;
  updated_at: Date;
  category_id: number;
  created_by: string;
};

type Category = {
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
  capital_price: number;
  category_id: number;
  image_url?: string | null;
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
  capital_price: number;
  image_url?: string | null;
  image_hash?: string | null;
  category_id: number;
};

export type SearchProductRequest = {
  name?: string;
  category?: number[];
  size: number;
  cursor?: number;
};

export type UpdateProductRequest = {
  id: number;
  name: string;
  availability: boolean;
  price: number;
  capital_price: number;
  image_url?: string | null;
  category_id: number;
};

export function toProductResponse(product: Product): ProductResponse {
  return {
    id: product.id,
    name: product.name,
    availability: product.availability,
    price: product.price,
    capital_price: product.capital_price,
    category_id: product.category_id,
    image_url: product.image_url ?? null,
    created_at: product.created_at,
    updated_at: product.updated_at,
  };
}

export function toProductAndPopulatedCategoryResponse(
  product: Product & { category: Category },
): ProductAndPopulatedCategoryResponse {
  return { ...toProductResponse(product), category: product.category };
}
