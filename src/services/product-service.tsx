import { privateAxios } from '@/apis/axios';
import { WithData } from '@/types';
import { CursorPageable } from '@/types/page-types';
import { ProductAndPopulatedCategoryResponse } from '@/types/product-types';
import { QueryFunctionContext } from '@tanstack/react-query';

class ProductService {
  static async create(
    formData: FormData,
  ): Promise<WithData<ProductAndPopulatedCategoryResponse>> {
    const response = await privateAxios.post('/api/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }

  static async search({
    queryKey,
    pageParam,
  }: QueryFunctionContext): Promise<
    CursorPageable<ProductAndPopulatedCategoryResponse>
  > {
    const [, filters] = queryKey;
    const response = await privateAxios.get(
      '/api/products?cursor=' + pageParam,
      {
        params: filters,
      },
    );
    return response.data;
  }

  static async count(): Promise<number> {
    const response = await privateAxios.get('/api/products/count');
    return (response.data as { data: number }).data;
  }

  static async update(
    formData: FormData,
  ): Promise<WithData<ProductAndPopulatedCategoryResponse>> {
    const id = JSON.parse(formData.get('document') as string).id;
    const response = await privateAxios.put('/api/products/' + id, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log(response.data);

    return response.data;
  }

  static async remove(id: number): Promise<number> {
    const response = await privateAxios.delete('/api/products/' + id);
    return response.data;
  }
}

export default ProductService;
