import { privateAxios } from '@/apis/axios';
import { WithData } from '@/types';
import {
  CreateOutboundRequest,
  OutboundAndPopulatedItemResponse,
  OutboundResponse,
  UpdateOutboundRequest,
} from '@/types/outbound-types';
import { Pageable } from '@/types/page-types';
import { QueryFunctionContext } from '@tanstack/react-query';

const outboundService = {
  create: async (
    request: CreateOutboundRequest,
  ): Promise<WithData<OutboundAndPopulatedItemResponse>> => {
    const response = await privateAxios.post(
      `/api/items/${request.itemId}/outbound`,
      request,
    );
    return response.data;
  },
  search: async ({
    queryKey,
  }: QueryFunctionContext): Promise<
    Pageable<OutboundAndPopulatedItemResponse>
  > => {
    const [, filters] = queryKey;
    const response = await privateAxios.get('/api/items/outbound', {
      params: filters,
    });
    return response.data;
  },
  getLast: async (): Promise<WithData<OutboundAndPopulatedItemResponse>> => {
    const response = await privateAxios.get('/api/items/outbound/last');
    return response.data;
  },
  list: async (): Promise<WithData<Array<OutboundResponse>>> => {
    const response = await privateAxios.get('/api/items/outbound/list');
    return response.data;
  },
  update: async (
    request: UpdateOutboundRequest,
  ): Promise<OutboundAndPopulatedItemResponse> => {
    const response = await privateAxios.put(
      `/api/items/${request.itemId}/outbound/${request.id}`,
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
    await privateAxios.delete(`/api/items/${itemId}/outbound/${id}`);
    return { itemId, id };
  },
};

export default outboundService;
