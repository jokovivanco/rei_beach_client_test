import { categoryKeys } from '@/constants/query-keys';
import CategoryService from '@/services/category-service';
import { SearchCategoryRequest } from '@/types/category-types';
import {
  infiniteQueryOptions,
  keepPreviousData,
  queryOptions,
} from '@tanstack/react-query';

export const searchCategoryQueryOption = (filters?: SearchCategoryRequest) =>
  infiniteQueryOptions({
    queryKey: categoryKeys.search(filters),
    queryFn: CategoryService.search,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.paging.cursor,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });

export const countCategoryQueryOption = () =>
  queryOptions({
    queryKey: categoryKeys.count,
    queryFn: CategoryService.count,
    refetchOnWindowFocus: false,
  });

export const listCategoryQueryOption = () =>
  queryOptions({
    queryKey: categoryKeys.all,
    queryFn: CategoryService.list,
    refetchOnWindowFocus: false,
  });
