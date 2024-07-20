import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDate } from '@/lib/utils';
import { OutboundAndPopulatedItemResponse } from '@/types/outbound-types';
import { Pageable } from '@/types/page-types';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { ArrowUpDown, Pencil } from 'lucide-react';
import React from 'react';
import CustomDialog from './CustomDialog';
import DeleteOutboundDialog from './DeleteOutboundDialog';
import EditOutboundForm from './forms/EditOutboundForm';
import { Button } from './ui/button';

interface OutboundTableProps {
  data: {
    data: Pageable<OutboundAndPopulatedItemResponse> | undefined;
    isPending: boolean;
  };
}

const columns: ColumnDef<OutboundAndPopulatedItemResponse>[] = [
  {
    accessorKey: 'updated_at',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          No
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="px-4">{row.index + 1}</div>,
  },
  {
    accessorKey: 'sku',
    header: 'No. Transaksi',
    cell: ({ row }) => <div className="px-4">{row.getValue('sku')}</div>,
    sortingFn: 'datetime',
  },
  {
    accessorKey: 'item',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Nama Barang
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="px-4">{row.original.item.name}</div>,
    sortingFn: (rowA, rowB) => {
      return rowA.original.item.name
        .toLowerCase()
        .localeCompare(rowB.original.item.name.toLowerCase());
    },
  },
  {
    accessorKey: 'issued_at',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Tanggal
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="px-4">{formatDate(row.getValue('issued_at'))}</div>
    ),
  },
  {
    accessorKey: 'quantity',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Barang Keluar
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="px-4">{row.getValue('quantity')}</div>,
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const original = row.original;
      return (
        <div className="flex items-center gap-2 w-full px-4">
          <CustomDialog
            buttonIcon={<Pencil size={16} />}
            buttonText="Edit"
            title="EDIT BARANG KELUAR"
          >
            {({ setOpen }) => (
              <EditOutboundForm currentData={original} setOpen={setOpen} />
            )}
          </CustomDialog>
          <DeleteOutboundDialog data={original} />
        </div>
      );
    },
  },
];

const OutboundTable = ({ data }: OutboundTableProps) => {
  const { data: outbounds, isPending } = data;
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data: outbounds?.data ?? [],
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <>
      <Table>
        <TableHeader>
          {!isPending &&
            table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
        </TableHeader>
        <TableBody>
          {outbounds?.data.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                No data found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
};
export default OutboundTable;
