import Loading from '@/components/custom-ui/Loading';
import { Toaster } from '@/components/ui/toaster';
import { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

type RouterContext = {
  queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: Root,
  notFoundComponent: () => <div>Not Found 404</div>,
  errorComponent: (error) => (
    <div>
      error occurred
      <br />
      {error.error.message}
    </div>
  ),
  pendingComponent: Loading,
});

function Root() {
  return (
    <>
      <Outlet />
      <Toaster />
      {/* <ReactQueryDevtools buttonPosition="bottom-right" />
      <TanStackRouterDevtools position="bottom-left" /> */}
    </>
  );
}
