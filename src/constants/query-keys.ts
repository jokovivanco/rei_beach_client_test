import { SearchCategoryRequest } from '@/types/category-types';
import { SearchProductRequest } from '@/types/product-types';
import { SortingState } from '@tanstack/react-table';

export const productKeys = {
  all: ['products'] as const,
  count: ['products', 'count'] as const,
  search: (sorting: SortingState, filters?: SearchProductRequest) =>
    filters
      ? ([...productKeys.all, sorting, filters] as const)
      : ([...productKeys.all, sorting, {}] as const),
};

export const categoryKeys = {
  all: ['categories'] as const,
  count: ['categories', 'count'] as const,
  search: (filters?: SearchCategoryRequest) =>
    filters
      ? ([...productKeys.all, filters] as const)
      : ([...productKeys.all, {}] as const),
};
