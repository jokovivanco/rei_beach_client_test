import { privateAxios } from '@/apis/axios';
import Avatar from '@/components/custom-ui/Avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { addOrderCart, getOrderCart } from '@/lib/storage-service';
import { CursorPageable } from '@/types/page-types';
import { ProductAndPopulatedCategoryResponse } from '@/types/product-types';
import {
  QueryFunctionContext,
  useInfiniteQuery,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Fragment, useEffect, useState } from 'react';

export const Route = createFileRoute('/_authenticated/cashier')({
  component: Cashier,
});

function Cashier() {
  const [cart, setCart] = useState(getOrderCart());

  // const fetchOrder = () => {
  //   const response =
  // }

  const fetchTableAvailable = async () => {
    const response = await privateAxios.get('/api/tables/list-available');
    return response.data;
  };

  const fetchProjects = async ({
    pageParam,
  }: QueryFunctionContext): Promise<
    CursorPageable<ProductAndPopulatedCategoryResponse>
  > => {
    const response = await privateAxios.get(
      '/api/products?cursor=' + pageParam,
    );
    return response.data;
  };

  const { data, error, fetchNextPage, isFetching, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ['products'],
      queryFn: fetchProjects,
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage.paging.cursor,
    });

  const hasMore = data?.pages?.[data.pages.length - 1]?.paging.hasMore;

  const { data: dataTable, isPending } = useQuery({
    queryKey: ['tables-available'],
    queryFn: fetchTableAvailable,
  });

  const { mutate } = useMutation({
    mutationFn: async (data: unknown) => {
      const responseOrder = await privateAxios.post('/api/orders', data);
      const orderProductsCart = getOrderCart().map((cart) => ({
        quantity: cart.quantity,
        product_id: cart.id,
        order_id: responseOrder.data.data.id,
      }));
      await privateAxios.post('/api/orders-products', orderProductsCart);
      localStorage.removeItem('order-cart');
      setCart([]);
    },
  });

  function onSubmit(e: any) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    mutate({
      customer: formData.get('customer'),
      note: formData.get('note'),
      payment_method: 'cash',
      table_id: Number(formData.get('tables')),
      total: getOrderCart().reduce(
        (acc, cur) => acc + cur.price * cur.quantity,
        0,
      ),
    });
  }

  return status === 'pending' ? (
    <p>Loading...</p>
  ) : status === 'error' ? (
    <p>Error: {error.message}</p>
  ) : (
    <div className="h-full flex">
      <div className="w-full bg-slate-400 py-6 px-4 overflow-y-auto">
        {data.pages.map((group) => (
          <Fragment key={group.paging.cursor}>
            {group.data.map((product) => (
              <div
                className="flex flex-wrap justify-between p-2 bg-green-400 w-full"
                key={product.id}
              >
                <div className="flex flex-wrap justify-between p-2 bg-green-400 w-full">
                  <div className="flex items-center gap-2 cont">
                    <div className="min-w-16 min-h-16 bg-secondary" />
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm">
                        Tersedia:{' '}
                        {product.availability ? 'Tersedia' : 'Tidak Tersedia'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">Rp. {product.price}</p>
                    <Button
                      className="rounded-sm"
                      onClick={() => {
                        addOrderCart({ ...product, quantity: 1 });
                        setCart(getOrderCart());
                      }}
                    >
                      Tambah
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </Fragment>
        ))}
        <div>
          <button
            onClick={() => fetchNextPage()}
            disabled={!hasMore || isFetchingNextPage}
          >
            {isFetchingNextPage
              ? 'Loading more...'
              : hasMore
                ? 'Load More'
                : 'Nothing more to load'}
          </button>
        </div>
        <div>{isFetching && !isFetchingNextPage ? 'Fetching...' : null}</div>
      </div>
      <div className="w-full bg-orange-300">
        <h2>Order</h2>
        <Tabs defaultValue="cart" className="w-[400px]">
          <TabsList>
            <TabsTrigger value="cart">Cart</TabsTrigger>
            <TabsTrigger value="order-list">OrderList</TabsTrigger>
            <TabsTrigger value="order-completed">Completed</TabsTrigger>
          </TabsList>
          <TabsContent value="cart">
            <div>
              {/* cart list */}
              {cart.map((cart) => (
                <div key={cart.id}>
                  <p>
                    {cart.name} <span>{cart.quantity}</span>
                  </p>
                </div>
              ))}
            </div>
            <div>
              {/* select table */}
              {!isPending && (
                <form onSubmit={onSubmit}>
                  <div className="flex flex-col items-start gap-2">
                    <select name="tables">
                      {dataTable?.data.map((table: any) => (
                        <option
                          value={table.id}
                          disabled={!table.availability}
                          key={table.id}
                        >
                          {table.name} {!table.availability ? '- Reserved' : ''}
                        </option>
                      ))}
                    </select>
                    <input name="customer" type="text" placeholder="Customer" />
                    <input name="note" type="text" placeholder="Keterangan" />
                    <Button type="submit">PAY</Button>
                  </div>
                </form>
              )}
            </div>
          </TabsContent>
          <TabsContent value="order-list">
            <div className="flex flex-col gap-2">
              <div>
                <Avatar avatarFallback="JO" />
              </div>
              <div>tes</div>
              <div>tes</div>
            </div>
          </TabsContent>
          <TabsContent value="order-completed">
            Change your password here.
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
