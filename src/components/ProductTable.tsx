import { categoryKeys, productKeys } from '@/constants/query-keys';
import { useProductEditMutation } from '@/hooks/mutations/product-mutation';
import { useProductSearch } from '@/hooks/queries/product-query';
import { formatToRupiah } from '@/lib/utils';
import {
  ProductAndPopulatedCategoryResponse,
  UpdateProductRequest,
} from '@/types/product-types';
import { useQueryClient } from '@tanstack/react-query';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  OnChangeFn,
  Row,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { ArrowDownUp, ArrowUpDown, Pencil, Plus } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import CustomDialog from './CustomDialog';
import DeleteProductDialog from './DeleteProductDialog';
import AddProductForm from './forms/AddProductForm';
import EditProductForm from './forms/EditPorductForm';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';

const ProductTable = () => {
  const queryClient = useQueryClient();
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [sorting, setSorting] = useState<SortingState>([]);

  const { mutate } = useProductEditMutation();

  const columns = useMemo<ColumnDef<ProductAndPopulatedCategoryResponse>[]>(
    () => [
      {
        accessorKey: 'image_url',
        header: () => <Button variant="ghost">Image</Button>,
        cell: ({ row }) => (
          <div>
            <div className="w-12 h-12">
              {row.getValue('image_url') ? (
                <img
                  src={`http://localhost:5000/${row.getValue('image_url')}`}
                  alt={row.getValue('image_url')}
                  className="object-cover w-12 h-12"
                />
              ) : (
                <div className="flex justify-center text-center items-center w-12 h-12 bg-slate-300 text-xs">
                  No Image
                </div>
              )}
            </div>
          </div>
        ),
        enableSorting: false,
        size: 100,
      },
      {
        accessorKey: 'name',
        header: ({ column }) => {
          return (
            <Button variant="ghost">
              Product Name
              {column.getIsSorted() === 'asc' ? (
                <ArrowUpDown className="ml-2 h-4 w-4" />
              ) : column.getIsSorted() === 'desc' ? (
                <ArrowDownUp className="ml-2 h-4 w-4" />
              ) : null}
            </Button>
          );
        },
        cell: ({ row }) => <div>{row.getValue('name')}</div>,
        size: 250,
      },
      {
        accessorKey: 'category',
        header: ({ column }) => {
          return (
            <Button variant="ghost">
              Category
              {column.getIsSorted() === 'asc' ? (
                <ArrowUpDown className="ml-2 h-4 w-4" />
              ) : column.getIsSorted() === 'desc' ? (
                <ArrowDownUp className="ml-2 h-4 w-4" />
              ) : null}
            </Button>
          );
        },
        cell: ({ row }) => <div>{row.original.category.name}</div>,
        size: 150,
      },
      {
        accessorKey: 'capital_price',
        header: ({ column }) => {
          return (
            <Button variant="ghost">
              Capital Price
              {column.getIsSorted() === 'asc' ? (
                <ArrowUpDown className="ml-2 h-4 w-4" />
              ) : column.getIsSorted() === 'desc' ? (
                <ArrowDownUp className="ml-2 h-4 w-4" />
              ) : null}
            </Button>
          );
        },
        cell: ({ row }) => (
          <div>{formatToRupiah(row.getValue('capital_price'))}</div>
        ),
        size: 120,
      },
      {
        accessorKey: 'price',
        header: ({ column }) => {
          return (
            <Button variant="ghost">
              Selling Price
              {column.getIsSorted() === 'asc' ? (
                <ArrowUpDown className="ml-2 h-4 w-4" />
              ) : column.getIsSorted() === 'desc' ? (
                <ArrowDownUp className="ml-2 h-4 w-4" />
              ) : null}
            </Button>
          );
        },
        cell: ({ row }) => <div>{formatToRupiah(row.getValue('price'))}</div>,
        size: 120,
      },
      {
        accessorKey: 'availability',
        header: ({ column }) => {
          return (
            <Button variant="ghost">
              Availability
              {column.getIsSorted() === 'asc' ? (
                <ArrowUpDown className="ml-2 h-4 w-4" />
              ) : column.getIsSorted() === 'desc' ? (
                <ArrowDownUp className="ml-2 h-4 w-4" />
              ) : null}
            </Button>
          );
        },
        cell: ({ row }) => {
          const original = row.original;

          return (
            <div>
              <Switch
                checked={row.getValue('availability')}
                onCheckedChange={async () => {
                  const request = {
                    ...original,
                    availability: !row.getValue('availability'),
                    id: original.id,
                    category_id: Number(original.category_id),
                    image_url: original.image_url ?? undefined,
                  } as UpdateProductRequest;
                  const formData = new FormData();
                  formData.append('document', JSON.stringify(request));
                  mutate(formData, {
                    onSuccess: async () => {
                      await queryClient.invalidateQueries({
                        queryKey: productKeys.all,
                      });
                      await queryClient.invalidateQueries({
                        queryKey: categoryKeys.all,
                      });
                      //   categorySocket.emit('changes');
                      //   router.invalidate();
                    },
                  });
                }}
              />
            </div>
          );
        },
        size: 150,
      },
      {
        id: 'action',
        cell: ({ row }) => {
          const original = row.original;
          return (
            <div className="flex items-center gap-2">
              <CustomDialog
                buttonIcon={<Pencil size={16} />}
                buttonText="Edit"
                title="EDIT BARANG"
              >
                {({ setOpen }) => (
                  <EditProductForm currentData={original} setOpen={setOpen} />
                )}
              </CustomDialog>
              <DeleteProductDialog data={original} />
            </div>
          );
        },
      },
    ],
    [],
  );

  const { data, fetchNextPage, isFetching, isLoading } =
    useProductSearch(sorting);

  const flatData = useMemo(
    () => data?.pages?.flatMap((page) => page.data) ?? [],
    [data],
  );

  const hasMore = data?.pages?.[0].paging.hasMore;

  const fetchMoreOnBottomReached = useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
        //once the user has scrolled within 400px of the bottom of the table, fetch more data if we can
        if (
          scrollHeight - scrollTop - clientHeight < 400 &&
          !isFetching &&
          hasMore
        ) {
          fetchNextPage();
        }
      }
    },
    [fetchNextPage, isFetching, hasMore],
  );

  useEffect(() => {
    fetchMoreOnBottomReached(tableContainerRef.current);
  }, [fetchMoreOnBottomReached]);

  const table = useReactTable({
    data: flatData,
    columns,
    state: {
      sorting,
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualSorting: true,
  });

  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    setSorting(updater);

    if (table.getRowModel().rows.length) {
      rowVirtualizer.scrollToIndex?.(0);
    }
  };

  table.setOptions((prev) => ({
    ...prev,
    onSortingChange: handleSortingChange,
  }));

  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 33, //estimate row height for accurate scrollbar dragging
    getScrollElement: () => tableContainerRef.current,
    //measure dynamic row height, except in firefox because it measures table border height incorrectly
    measureElement:
      typeof window !== 'undefined' &&
      navigator.userAgent.indexOf('Firefox') === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan: 5,
  });

  if (isLoading) {
    return <>Loading...</>;
  }

  return (
    <>
      <CustomDialog
        buttonIcon={<Plus size={24} />}
        buttonText="Add Product"
        title="Add Product"
        bgColor="bg-slate-900"
      >
        {({ setOpen }) => <AddProductForm setOpen={setOpen} />}
      </CustomDialog>

      {/* table */}
      <div
        className="custom-scrollbar overflow-y-auto mt-2 relative"
        style={{ maxHeight: 'calc(100% - 48px)' }}
        onScroll={(e) => fetchMoreOnBottomReached(e.target as HTMLDivElement)}
        ref={tableContainerRef}
      >
        <Table style={{ display: 'grid' }}>
          <TableHeader
            className="sticky top-0 bg-white"
            style={{
              display: 'grid',
              zIndex: 1,
            }}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="flex w-full">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="text-left pl-0"
                      style={{
                        width:
                          header.index === 6
                            ? header.getSize() + 100
                            : header.getSize(),
                      }}
                    >
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? 'cursor-pointer select-none'
                            : '',
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </div>
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody
            className="grid relative"
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`, //tells scrollbar how big the table is
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const row = rows[
                virtualRow.index
              ] as Row<ProductAndPopulatedCategoryResponse>;
              return (
                <TableRow
                  data-index={virtualRow.index} //needed for dynamic row height measurement
                  ref={(node) => rowVirtualizer.measureElement(node)} //measure dynamic row height
                  key={row.id}
                  style={{
                    display: 'flex',
                    position: 'absolute',
                    transform: `translateY(${virtualRow.start}px)`, //this should always be a `style` as it changes on scroll
                    width: '100%',
                  }}
                >
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <TableCell
                        key={cell.id}
                        style={{
                          display: 'flex',
                          width: cell.column.getSize(),
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      {isFetching && <div>Loading More...</div>}
    </>
  );
};

export default ProductTable;
