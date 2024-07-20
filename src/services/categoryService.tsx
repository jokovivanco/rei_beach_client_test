import { privateAxios } from '@/apis/axios';
import { WithData } from '@/types';
import {
  CategoryAndPopulatedItemsResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '@/types/category-types';
import { Pageable } from '@/types/page-types';
import { QueryFunctionContext } from '@tanstack/react-query';

const categoryService = {
  create: async (
    request: CreateCategoryRequest,
  ): Promise<WithData<CategoryAndPopulatedItemsResponse>> => {
    const response = await privateAxios.post('/api/categories', request);
    return response.data;
  },
  count: async (): Promise<WithData<number>> => {
    const response = await privateAxios.get('/api/categories/count');
    return response.data;
  },
  list: async (): Promise<
    WithData<Array<CategoryAndPopulatedItemsResponse>>
  > => {
    const response = await privateAxios.get('/api/categories/list');
    return response.data;
  },
  getLast: async (): Promise<WithData<CategoryAndPopulatedItemsResponse>> => {
    const response = await privateAxios.get('/api/items/last');
    return response.data;
  },
  search: async ({
    queryKey,
  }: QueryFunctionContext): Promise<
    Pageable<CategoryAndPopulatedItemsResponse>
  > => {
    const [, filters] = queryKey;
    const response = await privateAxios.get('/api/categories', {
      params: filters,
    });
    return response.data;
  },
  update: async (
    request: UpdateCategoryRequest,
  ): Promise<CategoryAndPopulatedItemsResponse> => {
    const response = await privateAxios.put(
      `/api/categories/${request.id}`,
      request,
    );
    return response.data;
  },
  remove: async (request: number): Promise<number> => {
    await privateAxios.delete(`/api/categories/${request}`);
    return request;
  },
};

export default categoryService;
