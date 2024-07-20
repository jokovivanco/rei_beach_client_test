import { keepPreviousData, queryOptions } from '@tanstack/react-query';
import userService from '@/services/userService';
import itemService from '@/services/itemService';
import categoryService from '@/services/categoryService';
import { SearchItemRequest } from '@/types/item-types';
import generalService from '@/services/generalService';
import { SearchCategoryRequest } from '@/types/category-types';
import { SearchInboundRequest } from '@/types/inbound-types';
import inboundService from '@/services/inboundService';
import outboundService from '@/services/outboundService';

export const refreshQueryOption = () =>
  queryOptions({
    queryKey: ['refresh'],
    queryFn: userService.refresh,
  });

export const countUserCategoryAndItemQueryOption = () =>
  queryOptions({
    queryKey: ['general', 'count'],
    queryFn: generalService.count,
  });

export const searchItemQueryOption = (filters: SearchItemRequest) =>
  queryOptions({
    queryKey: ['items', filters],
    queryFn: itemService.search,
    placeholderData: keepPreviousData,
  });

export const getLastItemQueryOption = () =>
  queryOptions({
    queryKey: ['items', 'lastId'],
    queryFn: itemService.getLast,
  });

export const getLastInboundQueryOption = () =>
  queryOptions({
    queryKey: ['inbound', 'lastId'],
    queryFn: inboundService.getLast,
  });

export const getLastOutboundQueryOption = () =>
  queryOptions({
    queryKey: ['outbound', 'lastId'],
    queryFn: outboundService.getLast,
  });

export const listCategoryQueryOption = () =>
  queryOptions({
    queryKey: ['categories'],
    queryFn: categoryService.list,
  });

export const listItemQueryOption = () =>
  queryOptions({
    queryKey: ['items'],
    queryFn: itemService.list,
  });

export const listInboundQueryOption = () =>
  queryOptions({
    queryKey: ['inbound'],
    queryFn: inboundService.list,
  });

export const listOutboundQueryOption = () =>
  queryOptions({
    queryKey: ['outbound'],
    queryFn: outboundService.list,
  });

export const getLastCategoryQueryOption = () =>
  queryOptions({
    queryKey: ['categories', 'lastId'],
    queryFn: categoryService.getLast,
  });

export const searchCategoryQueryOption = (filters: SearchCategoryRequest) =>
  queryOptions({
    queryKey: ['categories', filters],
    queryFn: categoryService.search,
    placeholderData: keepPreviousData,
  });

export const searchInboundQueryOption = (filters: SearchInboundRequest) =>
  queryOptions({
    queryKey: ['inbound', filters],
    queryFn: inboundService.search,
    placeholderData: keepPreviousData,
  });

export const searchOutboundQueryOption = (filters: SearchInboundRequest) =>
  queryOptions({
    queryKey: ['outbound', filters],
    queryFn: outboundService.search,
    placeholderData: keepPreviousData,
  });
