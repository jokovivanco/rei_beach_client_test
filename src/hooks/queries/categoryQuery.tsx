import {
  getLastCategoryQueryOption,
  listCategoryQueryOption,
  searchCategoryQueryOption,
} from '@/query/queryOptions';
import { SearchCategoryRequest } from '@/types/category-types';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';

export const useListCategoryQuery = () =>
  useSuspenseQuery(listCategoryQueryOption());

export const useLastCategoryQuery = () =>
  useSuspenseQuery(getLastCategoryQueryOption());

export const useCategoryQuery = (filters: SearchCategoryRequest) =>
  useQuery(searchCategoryQueryOption(filters));
