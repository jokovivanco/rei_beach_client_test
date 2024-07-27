import { itemSocket } from '@/apis/sockets';
import TableContainer from '@/components/containers/TableContainer';
import Breadcrumb from '@/components/custom-ui/Breadcrumb';
import CustomDialog from '@/components/CustomDialog';
import Filters from '@/components/Filters';
import AddItemForm from '@/components/forms/AddItemForm';
import ItemTable from '@/components/ItemTable';
import Pagination from '@/components/Pagination';
import Search from '@/components/Search';
import SelectSize from '@/components/SelectSize';
import { DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { useItemQuery } from '@/hooks/queries/itemQuery';
import {
  getLastItemQueryOption,
  listCategoryQueryOption,
  searchItemQueryOption,
} from '@/lib/query/queryOptions';
import { SearchItemRequest } from '@/types/item-types';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Plus } from 'lucide-react';
import { useEffect } from 'react';

export const Route = createFileRoute('/_authenticated/items')({
  loader: async ({ context: { queryClient } }) => {
    return await Promise.all([
      queryClient.ensureQueryData(listCategoryQueryOption()),
      queryClient.ensureQueryData(getLastItemQueryOption()),
      queryClient.ensureQueryData(searchItemQueryOption({})),
    ]);
  },
  component: Items,
});

function Items() {
  const queryClient = useQueryClient();
  const queryParams = Route.useSearch<SearchItemRequest>();
  const { data, isPending } = useItemQuery(queryParams);

  useEffect(() => {
    function onChange() {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    }

    itemSocket.connect();
    itemSocket.on('changes', onChange);

    return () => {
      itemSocket.disconnect();
      itemSocket.off('changes', onChange);
    };
  }, [queryClient]);

  return (
    <div className="flex flex-col gap-4">
      <Breadcrumb paths={['Data Master', 'Barang']} />
      <TableContainer>
        <div className="flex items-center gap-2">
          <h2 className="font-medium text-lg flex-1">Data Barang</h2>
          <CustomDialog
            buttonIcon={<Plus size={24} />}
            buttonText="Tambah Barang"
            title="TAMBAH BARANG"
            bgColor="bg-green-700"
            bgColorHover="bg-green-600"
          >
            {({ setOpen }) => <AddItemForm setOpen={setOpen} />}
          </CustomDialog>
        </div>
        <DropdownMenuSeparator className="my-4" />
        <div className="flex items-center mb-4 gap-2 justify-between">
          <SelectSize<SearchItemRequest> from={Route.id} />
          <div className="flex items-center justify-center gap-2">
            <Search<SearchItemRequest> from={Route.id} />
            <Filters from={Route.id} />
          </div>
        </div>
        <ItemTable data={{ data, isPending }} />
        <Pagination data={{ data, isPending }} searchParams={queryParams} />
      </TableContainer>
    </div>
  );
}
