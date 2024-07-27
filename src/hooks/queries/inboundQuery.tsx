import {
  getLastInboundQueryOption,
  listInboundQueryOption,
  searchInboundQueryOption,
} from '@/lib/query/queryOptions';
import { SearchInboundRequest } from '@/types/inbound-types';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';

export const useLastInboundQuery = () =>
  useSuspenseQuery(getLastInboundQueryOption());

export const useInboundQuery = (filters: SearchInboundRequest) =>
  useQuery(searchInboundQueryOption(filters));

export const useListInboundQuery = () =>
  useSuspenseQuery(listInboundQueryOption());
