import { privateAxios } from '@/apis/axios';
import { WithData } from '@/types';
import {
  CreateItemRequest,
  ItemAndPopulatedCategoryResponse,
  UpdateItemRequest,
} from '@/types/item-types';
import { Pageable } from '@/types/page-types';
import { QueryFunctionContext } from '@tanstack/react-query';

const itemService = {
  create: async (
    request: CreateItemRequest,
  ): Promise<WithData<ItemAndPopulatedCategoryResponse>> => {
    const response = await privateAxios.post('/api/items', request);
    return response.data;
  },
  count: async (): Promise<WithData<number>> => {
    const response = await privateAxios.get('/api/items/count');
    return response.data;
  },
  search: async ({
    queryKey,
  }: QueryFunctionContext): Promise<
    Pageable<ItemAndPopulatedCategoryResponse>
  > => {
    const [, filters] = queryKey;
    const response = await privateAxios.get('/api/items', {
      params: filters,
    });
    return response.data;
  },
  list: async (): Promise<
    WithData<Array<ItemAndPopulatedCategoryResponse>>
  > => {
    const response = await privateAxios.get('/api/items/list');
    return response.data;
  },
  getLast: async (): Promise<WithData<ItemAndPopulatedCategoryResponse>> => {
    const response = await privateAxios.get('/api/items/last');
    return response.data;
  },
  update: async (
    request: UpdateItemRequest,
  ): Promise<ItemAndPopulatedCategoryResponse> => {
    const response = await privateAxios.put(
      `/api/items/${request.id}`,
      request,
    );
    return response.data;
  },
  remove: async (request: number): Promise<number> => {
    await privateAxios.delete(`/api/items/${request}`);
    return request;
  },
};

export default itemService;
