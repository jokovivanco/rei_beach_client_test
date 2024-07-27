import { countUserCategoryAndItemQueryOption } from '@/lib/query/queryOptions';
import { useSuspenseQuery } from '@tanstack/react-query';

export const useSummaryDataCountQuery = () =>
  useSuspenseQuery(countUserCategoryAndItemQueryOption());
