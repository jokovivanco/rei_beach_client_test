import {
  getLastOutboundQueryOption,
  listOutboundQueryOption,
  searchOutboundQueryOption,
} from '@/lib/query/queryOptions';
import { SearchOutboundRequest } from '@/types/outbound-types';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';

export const useLastOutboundQuery = () =>
  useSuspenseQuery(getLastOutboundQueryOption());

export const useOutboundQuery = (filters: SearchOutboundRequest) =>
  useQuery(searchOutboundQueryOption(filters));

export const useListOutboundQuery = () =>
  useSuspenseQuery(listOutboundQueryOption());
