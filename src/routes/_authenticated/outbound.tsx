import { outboundSocket } from '@/apis/sockets';
import TableContainer from '@/components/containers/TableContainer';
import Breadcrumb from '@/components/custom-ui/Breadcrumb';
import CustomDialog from '@/components/CustomDialog';
import AddOutboundForm from '@/components/forms/AddOutboundForm';
import OutboundTable from '@/components/OutboundTable';
import Pagination from '@/components/Pagination';
import Search from '@/components/Search';
import SelectSize from '@/components/SelectSize';
import { useOutboundQuery } from '@/hooks/queries/outboundQuery';
import {
  getLastOutboundQueryOption,
  listCategoryQueryOption,
  listItemQueryOption,
  searchOutboundQueryOption,
} from '@/lib/query/queryOptions';
import { SearchOutboundRequest } from '@/types/outbound-types';
import { DropdownMenuSeparator } from '@radix-ui/react-dropdown-menu';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Plus } from 'lucide-react';
import { useEffect } from 'react';

export const Route = createFileRoute('/_authenticated/outbound')({
  loader: async ({ context: { queryClient } }) => {
    return await Promise.all([
      queryClient.ensureQueryData(listCategoryQueryOption()),
      queryClient.ensureQueryData(searchOutboundQueryOption({})),
      queryClient.ensureQueryData(getLastOutboundQueryOption()),
      queryClient.ensureQueryData(listItemQueryOption()),
    ]);
  },
  component: Outbound,
});

function Outbound() {
  const queryClient = useQueryClient();
  const queryParams = Route.useSearch<SearchOutboundRequest>();
  const { data, isPending } = useOutboundQuery(queryParams);

  useEffect(() => {
    function onChange() {
      queryClient.invalidateQueries({ queryKey: ['outbound'] });
    }

    outboundSocket.connect();
    outboundSocket.on('changes', onChange);

    return () => {
      outboundSocket.disconnect();
      outboundSocket.off('changes', onChange);
    };
  }, [queryClient]);

  return (
    <div className="flex flex-col gap-4">
      <Breadcrumb paths={['Data Barang', 'Barang Keluar']} />
      <TableContainer>
        <div className="flex items-center gap-2">
          <h2 className="font-medium text-lg flex-1">
            Transaksi Barang Keluar
          </h2>
          <CustomDialog
            buttonIcon={<Plus size={24} />}
            buttonText="Tambah Barang"
            title="TAMBAH BARANG KELUAR"
            bgColor="bg-green-700"
            bgColorHover="bg-green-600"
          >
            {({ setOpen }) => <AddOutboundForm setOpen={setOpen} />}
          </CustomDialog>
        </div>
        <DropdownMenuSeparator className="my-4" />
        <div className="flex items-center mb-4 gap  -2 justify-between">
          <SelectSize<SearchOutboundRequest> from={Route.id} />
          <Search<SearchOutboundRequest> from={Route.id} />
        </div>
        <OutboundTable data={{ data, isPending }} />
        <Pagination data={{ data, isPending }} searchParams={queryParams} />
      </TableContainer>
    </div>
  );
}
