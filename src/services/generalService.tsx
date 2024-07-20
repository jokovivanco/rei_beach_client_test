import { privateAxios } from '@/apis/axios';
import { GeneralCountResponse, WithData } from '@/types';

const generalService = {
  count: async (): Promise<WithData<GeneralCountResponse>> => {
    const response = await privateAxios.get('/api/general/count');
    return response.data;
  },
};

export default generalService;
