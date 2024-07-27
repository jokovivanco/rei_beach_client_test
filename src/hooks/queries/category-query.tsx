import {
  countCategoryQueryOption,
  searchCategoryQueryOption,
} from '@/lib/query/category-options';
import { listCategoryQueryOption } from '@/lib/query/queryOptions';
import { SearchCategoryRequest } from '@/types/category-types';
import { useInfiniteQuery, useSuspenseQuery } from '@tanstack/react-query';

export const useCategorySearch = (filters?: SearchCategoryRequest) =>
  useInfiniteQuery(searchCategoryQueryOption(filters));

export const useCategoryCount = () =>
  useSuspenseQuery(countCategoryQueryOption());

export const useCategoryList = () =>
  useSuspenseQuery(listCategoryQueryOption());
