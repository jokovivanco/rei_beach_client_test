import { productKeys } from '@/constants/query-keys';
import ProductService from '@/services/product-service';
import { SearchProductRequest } from '@/types/product-types';
import {
  infiniteQueryOptions,
  keepPreviousData,
  queryOptions,
} from '@tanstack/react-query';
import { SortingState } from '@tanstack/react-table';

export const searchProductQueryOption = (
  sorting: SortingState,
  filters?: SearchProductRequest,
) =>
  infiniteQueryOptions({
    queryKey: productKeys.search(sorting, filters),
    queryFn: ProductService.search,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.paging.cursor,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });

export const countProductQueryOption = () =>
  queryOptions({
    queryKey: productKeys.count,
    queryFn: ProductService.count,
    refetchOnWindowFocus: false,
  });
