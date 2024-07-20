import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CategoryAndPopulatedItemsResponse } from '@/types/category-types';
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
import DeleteCategoryDialog from './DeleteCategoryDialog';
import EditCategoryForm from './forms/EditCategoryForm';
import { Button } from './ui/button';

interface CategoryTableProps {
  data: {
    data: Pageable<CategoryAndPopulatedItemsResponse> | undefined;
    isPending: boolean;
  };
}

const columns: ColumnDef<CategoryAndPopulatedItemsResponse>[] = [
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
    accessorKey: '_count',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Varian
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="px-4">{row.original._count.items}</div>,
    sortingFn: (rowA, rowB) => {
      return rowA.original._count.items - rowB.original._count.items;
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
          >
            {({ setOpen }) => (
              <EditCategoryForm currentData={original} setOpen={setOpen} />
            )}
          </CustomDialog>
          <DeleteCategoryDialog data={original} />
        </div>
      );
    },
  },
];

const CategoryTable = ({ data }: CategoryTableProps) => {
  const { data: categories, isPending } = data;
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data: categories?.data ?? [],
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
          {categories?.data.length ? (
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
export default CategoryTable;
