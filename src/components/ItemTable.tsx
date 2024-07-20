import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ItemAndPopulatedCategoryResponse } from '@/types/item-types';
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
import React, { useEffect } from 'react';
import CustomDialog from './CustomDialog';
import DeleteItemDialog from './DeleteItemDialog';
import EditItemForm from './forms/EditItemForm';
import { Button } from './ui/button';

interface ItemTableProps {
  data: {
    data: Pageable<ItemAndPopulatedCategoryResponse> | undefined;
    isPending: boolean;
  };
}

const columns: ColumnDef<ItemAndPopulatedCategoryResponse>[] = [
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
    accessorKey: 'name',
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
    cell: ({ row }) => <div className="px-4">{row.getValue('name')}</div>,
    sortingFn: 'alphanumeric',
  },
  {
    accessorKey: 'sku',
    header: 'ID Barang',
    cell: ({ row }) => <div className="px-4">{row.getValue('sku')}</div>,
  },
  {
    accessorKey: 'category',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Kategori
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="px-4 whitespace-nowrap">{row.original.category.name}</div>
    ),
    sortingFn: (rowA, rowB) => {
      return rowA.original.category.name
        .toLowerCase()
        .localeCompare(rowB.original.category.name.toLowerCase());
    },
  },
  {
    accessorKey: 'quantity',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Qty
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="px-4">{row.getValue('quantity')}</div>,
  },
  {
    accessorKey: 'unit',
    header: 'Unit',
    cell: ({ row }) => <div>{row.getValue('unit')}</div>,
  },
  {
    accessorKey: 'notes',
    header: 'Catatan',
    cell: ({ row }) => <div>{row.getValue('notes')}</div>,
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
            title="EDIT BARANG"
          >
            {({ setOpen }) => (
              <EditItemForm currentData={original} setOpen={setOpen} />
            )}
          </CustomDialog>
          <DeleteItemDialog data={original} />
        </div>
      );
    },
  },
];

const ItemTable = ({ data }: ItemTableProps) => {
  const { data: items, isPending } = data;

  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data: items?.data ?? [],
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  useEffect(() => {
    console.log(isPending);
  }, [isPending]);

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
          {items?.data.length ? (
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
export default ItemTable;
