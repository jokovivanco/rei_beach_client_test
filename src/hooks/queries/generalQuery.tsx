import { countUserCategoryAndItemQueryOption } from '@/query/queryOptions';
import { useSuspenseQuery } from '@tanstack/react-query';

export const useSummaryDataCountQuery = () =>
  useSuspenseQuery(countUserCategoryAndItemQueryOption());
