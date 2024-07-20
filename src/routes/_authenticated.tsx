import { privateAxios } from '@/apis/axios';
import Header from '@/components/layouts/Header';
import Sidebar from '@/components/layouts/Sidebar';
import { cn } from '@/lib/utils';
import { refreshQueryOption } from '@/query/queryOptions';
import userService from '@/services/userService';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { AxiosError, InternalAxiosRequestConfig } from 'axios';

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
      <div className="h-screen flex flex-col relative">
        <Header />
        <div className="flex-1 flex overflow-hidden">
          <Sidebar />
          <div
            className={cn(
              'bg-sky-500 flex-1 overflow-auto transition-all duration-300 ease-in ',
            )}
          >
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}
