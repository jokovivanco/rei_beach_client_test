import { refreshQueryOption } from '@/lib/query/queryOptions';
import { useSuspenseQuery } from '@tanstack/react-query';

export const useRefreshQuery = () => useSuspenseQuery(refreshQueryOption());
