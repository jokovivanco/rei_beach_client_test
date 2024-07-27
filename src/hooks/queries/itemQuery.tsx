import {
  getLastItemQueryOption,
  listItemQueryOption,
  searchItemQueryOption,
} from '@/lib/query/queryOptions';
import { SearchItemRequest } from '@/types/item-types';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';

export const useItemQuery = (filters: SearchItemRequest) =>
  useQuery(searchItemQueryOption(filters));

export const useLastItemQuery = () =>
  useSuspenseQuery(getLastItemQueryOption());

export const useListItemQuery = () => useSuspenseQuery(listItemQueryOption());
