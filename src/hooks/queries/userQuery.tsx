import { refreshQueryOption } from '@/query/queryOptions';
import { useSuspenseQuery } from '@tanstack/react-query';

export const useRefreshQuery = () => useSuspenseQuery(refreshQueryOption());
