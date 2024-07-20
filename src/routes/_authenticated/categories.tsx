import { categorySocket } from '@/apis/sockets';
import CategoryTable from '@/components/CategoryTable';
import TableContainer from '@/components/containers/TableContainer';
import Breadcrumb from '@/components/custom-ui/Breadcrumb';
import CustomDialog from '@/components/CustomDialog';
import AddCategoryForm from '@/components/forms/AddCategoryForm';
import Pagination from '@/components/Pagination';
import Search from '@/components/Search';
import SelectSize from '@/components/SelectSize';
import { useCategoryQuery } from '@/hooks/queries/categoryQuery';
import { searchCategoryQueryOption } from '@/query/queryOptions';
import { SearchCategoryRequest } from '@/types/category-types';
import { DropdownMenuSeparator } from '@radix-ui/react-dropdown-menu';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Plus } from 'lucide-react';
import { useEffect } from 'react';

export const Route = createFileRoute('/_authenticated/categories')({
  loader: async ({ context: { queryClient } }) => {
    return await queryClient.ensureQueryData(searchCategoryQueryOption({}));
  },
  component: Categories,
});

function Categories() {
  const queryClient = useQueryClient();
  const queryParams = Route.useSearch<SearchCategoryRequest>();
  const { data, isPending } = useCategoryQuery(queryParams);

  useEffect(() => {
    function onChange() {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    }

    categorySocket.connect();
    categorySocket.on('changes', onChange);

    return () => {
      categorySocket.disconnect();
      categorySocket.off('changes', onChange);
    };
  }, [queryClient]);

  return (
    <div className="flex flex-col gap-4">
      <Breadcrumb paths={['Data Master', 'Kategori']} />
      <TableContainer>
        <div className="flex items-center gap-2">
          <h2 className="font-medium text-lg flex-1">Data Kategori</h2>
          <CustomDialog
            buttonIcon={<Plus size={24} />}
            buttonText="Tambah Kategori"
            title="TAMBAH KATEGORI"
            bgColor="bg-green-700"
            bgColorHover="bg-green-600"
          >
            {({ setOpen }) => <AddCategoryForm setOpen={setOpen} />}
          </CustomDialog>
        </div>
        <DropdownMenuSeparator className="my-4" />
        <div className="flex items-center mb-4 gap-2 justify-between">
          <SelectSize<SearchCategoryRequest> from={Route.id} />
          <Search<SearchCategoryRequest> from={Route.id} />
        </div>
        <CategoryTable data={{ data, isPending }} />
        <Pagination data={{ data, isPending }} searchParams={queryParams} />
      </TableContainer>
    </div>
  );
}
