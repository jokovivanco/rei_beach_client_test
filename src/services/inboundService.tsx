import { privateAxios } from '@/apis/axios';
import { WithData } from '@/types';
import {
  CreateInboundRequest,
  InboundAndPopulatedItemResponse,
  InboundResponse,
  UpdateInboundRequest,
} from '@/types/inbound-types';
import { Pageable } from '@/types/page-types';
import { QueryFunctionContext } from '@tanstack/react-query';

const inboundService = {
  create: async (
    request: CreateInboundRequest,
  ): Promise<WithData<InboundAndPopulatedItemResponse>> => {
    const response = await privateAxios.post(
      `/api/items/${request.itemId}/inbound`,
      request,
    );
    return response.data;
  },
  search: async ({
    queryKey,
  }: QueryFunctionContext): Promise<
    Pageable<InboundAndPopulatedItemResponse>
  > => {
    const [, filters] = queryKey;
    const response = await privateAxios.get('/api/items/inbound', {
      params: filters,
    });
    return response.data;
  },
  getLast: async (): Promise<WithData<InboundAndPopulatedItemResponse>> => {
    const response = await privateAxios.get('/api/items/inbound/last');
    return response.data;
  },
  list: async (): Promise<WithData<Array<InboundResponse>>> => {
    const response = await privateAxios.get('/api/items/inbound/list');
    return response.data;
  },
  update: async (
    request: UpdateInboundRequest,
  ): Promise<InboundAndPopulatedItemResponse> => {
    const response = await privateAxios.put(
      `/api/items/${request.itemId}/inbound/${request.id}`,
      request,
    );
    return response.data;
  },
  remove: async ({
    itemId,
    id,
  }: {
    itemId: number;
    id: number;
  }): Promise<{ itemId: number; id: number }> => {
    await privateAxios.delete(`/api/items/${itemId}/inbound/${id}`);
    return { itemId, id };
  },
};

export default inboundService;
