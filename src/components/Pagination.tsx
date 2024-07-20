import { CategoryAndPopulatedItemsResponse } from '@/types/category-types';
import { InboundAndPopulatedItemResponse } from '@/types/inbound-types';
import { ItemAndPopulatedCategoryResponse } from '@/types/item-types';
import { OutboundAndPopulatedItemResponse } from '@/types/outbound-types';
import { Pageable } from '@/types/page-types';
import { useNavigate } from '@tanstack/react-router';
import { Button } from './ui/button';

interface PaginationProps {
  data: {
    data:
      | Pageable<
          | ItemAndPopulatedCategoryResponse
          | InboundAndPopulatedItemResponse
          | OutboundAndPopulatedItemResponse
          | CategoryAndPopulatedItemsResponse
        >
      | undefined;
    isPending: boolean;
  };
  searchParams: { page?: number };
}

const Pagination = ({ data, searchParams }: PaginationProps) => {
  const page = searchParams.page ? +searchParams.page : 1;
  const navigation = useNavigate();

  function handleNavigation(direction: string) {
    const nextPageNumber = direction === 'prev' ? page - 1 : page + 1;

    navigation({
      search: (old) => ({
        ...old,
        page: nextPageNumber,
      }),
    });
  }

  return (
    <div className="flex justify-end mt-4">
      <div className="flex w-fititems-center justify-center gap-2">
        {!data.isPending && (
          <>
            <Button
              disabled={page === 1}
              onClick={() => handleNavigation('prev')}
              className="light-border-2 btn flex min-h-[36px] items-center justify-center gap-2 border"
            >
              <p className="body-medium text-dark200_light800">Sebelumnya</p>
            </Button>
            <div className="flex items-center justify-center rounded-md bg-primary-500 px-3.5 py-2">
              <p className="body-semibold text-light-900">
                <span className="font-bold">{page}</span> dari{' '}
                {data?.data?.paging.total_page}
              </p>
            </div>
            <Button
              disabled={!data?.data?.paging.isNext || data.isPending}
              onClick={() => handleNavigation('next')}
              className="light-border-2 btn flex min-h-[36px] items-center justify-center gap-2 border"
            >
              <p className="body-medium text-dark200_light800">Selanjutnya</p>
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
export default Pagination;
