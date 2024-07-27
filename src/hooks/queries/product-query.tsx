import {
  countProductQueryOption,
  searchProductQueryOption,
} from '@/lib/query/product-options';
import { SearchProductRequest } from '@/types/product-types';
import { useInfiniteQuery, useSuspenseQuery } from '@tanstack/react-query';
import { SortingState } from '@tanstack/react-table';

export const useProductSearch = (
  sorting: SortingState,
  filters?: SearchProductRequest,
) => useInfiniteQuery(searchProductQueryOption(sorting, filters));

export const useProductCount = () =>
  useSuspenseQuery(countProductQueryOption());
