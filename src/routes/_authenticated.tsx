import { privateAxios } from '@/apis/axios';
import Header from '@/components/layouts/Header';
import Sidebar from '@/components/layouts/Sidebar';
import { refreshQueryOption } from '@/lib/query/queryOptions';
import userService from '@/services/userService';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { createContext, useRef } from 'react';

type AxiosErrorConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

export const Route = createFileRoute('/_authenticated')({
  loader: async ({ context: { queryClient } }) => {
    privateAxios.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error?.config) {
          const originalRequest: AxiosErrorConfig = error.config;
          if (error?.response?.status === 401 && !originalRequest?._retry) {
            originalRequest._retry = true;
            const user = await userService.refresh();
            const newAccessToken = user.access_token;
            if (newAccessToken) {
              localStorage.setItem('token', newAccessToken);
              await queryClient.setQueryData(['refresh'], user);
              originalRequest.headers['authorization'] =
                `Bearer ${newAccessToken}`;
              return privateAxios(originalRequest);
            }
          }
          return Promise.reject(error);
        }
      },
    );
    return await queryClient.ensureQueryData(refreshQueryOption());
  },
  onError: () => {
    throw redirect({ to: '/login' });
  },
  component: AuthenticatedRoot,
});

function AuthenticatedRoot() {
  return (
    <>
      <div className="h-screen flex flex-col">
        <Header />
        <div className="h-full flex">
          <Sidebar />
          <div className="w-full transition-all duration-300 ease-in overflow-x-hidden">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}
