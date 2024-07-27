import { privateAxios } from '@/apis/axios';
import { WithData } from '@/types';
import {
  CategoryAndPopulatedProductsResponse,
  CategoryResponse,
} from '@/types/category-types';
import { CursorPageable } from '@/types/page-types';
import { QueryFunctionContext } from '@tanstack/react-query';

class CategoryService {
  static async search({
    queryKey,
  }: QueryFunctionContext): Promise<
    CursorPageable<CategoryAndPopulatedProductsResponse>
  > {
    const [, filters] = queryKey;
    const response = await privateAxios.get('/api/categories', {
      params: filters,
    });
    return response.data;
  }

  static async count(): Promise<number> {
    const response = await privateAxios.get('/api/categories/count');
    return (response.data as { data: number }).data;
  }

  static async list(): Promise<WithData<CategoryResponse[]>> {
    const response = await privateAxios.get('/api/categories/list');
    return response.data;
  }
}
export default CategoryService;
