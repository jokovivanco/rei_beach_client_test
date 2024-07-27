import { inboundSocket } from '@/apis/sockets';
import TableContainer from '@/components/containers/TableContainer';
import Breadcrumb from '@/components/custom-ui/Breadcrumb';
import CustomDialog from '@/components/CustomDialog';
import AddInboundForm from '@/components/forms/AddInboundForm';
import InboundTable from '@/components/InboundTable';
import Pagination from '@/components/Pagination';
import Search from '@/components/Search';
import SelectSize from '@/components/SelectSize';
import { useInboundQuery } from '@/hooks/queries/inboundQuery';
import {
  getLastInboundQueryOption,
  listCategoryQueryOption,
  listItemQueryOption,
  searchInboundQueryOption,
} from '@/lib/query/queryOptions';
import { SearchInboundRequest } from '@/types/inbound-types';
import { DropdownMenuSeparator } from '@radix-ui/react-dropdown-menu';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Plus } from 'lucide-react';
import { useEffect } from 'react';

export const Route = createFileRoute('/_authenticated/inbound')({
  loader: async ({ context: { queryClient } }) => {
    return await Promise.all([
      queryClient.ensureQueryData(listCategoryQueryOption()),
      queryClient.ensureQueryData(searchInboundQueryOption({})),
      queryClient.ensureQueryData(getLastInboundQueryOption()),
      queryClient.ensureQueryData(listItemQueryOption()),
    ]);
  },
  component: Inbound,
});

function Inbound() {
  const queryClient = useQueryClient();
  const queryParams = Route.useSearch<SearchInboundRequest>();
  const { data, isPending } = useInboundQuery(queryParams);

  useEffect(() => {
    function onChange() {
      queryClient.invalidateQueries({ queryKey: ['inbound'] });
    }

    inboundSocket.connect();
    inboundSocket.on('changes', onChange);

    return () => {
      inboundSocket.disconnect();
      inboundSocket.off('changes', onChange);
    };
  }, [queryClient]);

  return (
    <div className="flex flex-col gap-4">
      <Breadcrumb paths={['Data Barang', 'Barang Masuk']} />
      <TableContainer>
        <div className="flex items-center gap-2">
          <h2 className="font-medium text-lg flex-1">Transaksi Barang Masuk</h2>
          <CustomDialog
            buttonIcon={<Plus size={24} />}
            buttonText="Tambah Barang"
            title="TAMBAH BARANG MASUK"
            bgColor="bg-green-700"
            bgColorHover="bg-green-600"
          >
            {({ setOpen }) => <AddInboundForm setOpen={setOpen} />}
          </CustomDialog>
        </div>
        <DropdownMenuSeparator className="my-4" />
        <div className="flex items-center mb-4 gap-2 justify-between">
          <SelectSize<SearchInboundRequest> from={Route.id} />
          <Search<SearchInboundRequest> from={Route.id} />
        </div>
        <InboundTable data={{ data, isPending }} />
        <Pagination data={{ data, isPending }} searchParams={queryParams} />
      </TableContainer>
    </div>
  );
}
