import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDate, formatToRupiah } from '@/lib/utils';
import { InboundAndPopulatedItemResponse } from '@/types/inbound-types';
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
import DeleteInboundDialog from './DeleteInboundDialog';
import EditInboundForm from './forms/EditInboundForm';
import { Button } from './ui/button';

interface InboundTableProps {
  data: {
    data: Pageable<InboundAndPopulatedItemResponse> | undefined;
    isPending: boolean;
  };
}

const columns: ColumnDef<InboundAndPopulatedItemResponse>[] = [
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
    sortingFn: 'datetime',
  },
  {
    accessorKey: 'sku',
    header: 'No. Transaksi',
    cell: ({ row }) => <div className="px-4">{row.getValue('sku')}</div>,
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
    sortingFn: 'datetime',
  },
  {
    accessorKey: 'quantity',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Barang Masuk
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="px-4">{row.getValue('quantity')}</div>,
    sortingFn: (rowA, rowB) => {
      return rowA.original.item.name
        .toLowerCase()
        .localeCompare(rowB.original.item.name.toLowerCase());
    },
  },

  {
    id: 'total',
    accessorFn: (original) => {
      const quantity = Number(original.quantity);
      const price = Number(original.price);
      const total = quantity * price;
      return total;
    },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Total
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="px-4">{formatToRupiah(row.getValue('total'))}</div>
      );
    },
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
            title="EDIT BARANG MASUK"
            disabled={original.item.deleted}
          >
            {({ setOpen }) => (
              <EditInboundForm currentData={original} setOpen={setOpen} />
            )}
          </CustomDialog>
          <DeleteInboundDialog
            disabled={original.item.deleted}
            data={original}
          />
        </div>
      );
    },
  },
];

const InboundTable = ({ data }: InboundTableProps) => {
  const { data: inbounds, isPending } = data;
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data: inbounds?.data ?? [],
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
          {inbounds?.data.length ? (
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
export default InboundTable;
