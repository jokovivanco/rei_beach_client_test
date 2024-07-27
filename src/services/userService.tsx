import { privateAxios, publicAxios } from '@/apis/axios';
import { WithData } from '@/types';
import {
  CreateUserRequest,
  LoginResponse,
  LoginUserRequest,
  RefreshResponse,
  UserResponse,
} from '@/types/user-types';

const userService = {
  login: async (request: LoginUserRequest): Promise<LoginResponse> => {
    const response = await publicAxios.post('/api/users/login', request);
    return response.data;
  },
  register: async (
    request: CreateUserRequest,
  ): Promise<WithData<UserResponse>> => {
    const response = await publicAxios.post('/api/users', request);
    return response.data;
  },
  refresh: async (): Promise<RefreshResponse> => {
    const response = await publicAxios.get('/api/users/refresh');
    // localStorage.setItem('token', response.data.access_token);
    return response.data;
  },
  count: async (): Promise<WithData<number>> => {
    const response = await privateAxios.get('/api/users/count');
    return response.data;
  },
  list: async (): Promise<WithData<Array<UserResponse>>> => {
    const response = await privateAxios.get('/api/users/list');
    return response.data;
  },
};

export default userService;
