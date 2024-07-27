import ContentContainer from '@/components/containers/ContentContainer';
import ProductTable from '@/components/ProductTable';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCategoryCount } from '@/hooks/queries/category-query';
import { useProductCount } from '@/hooks/queries/product-query';
import { countCategoryQueryOption } from '@/lib/query/category-options';
import { countProductQueryOption } from '@/lib/query/product-options';
import { listCategoryQueryOption } from '@/lib/query/queryOptions';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/product')({
  loader: async ({ context: { queryClient } }) => {
    await Promise.all([
      await queryClient.ensureQueryData(countProductQueryOption()),
      await queryClient.ensureQueryData(countCategoryQueryOption()),
      await queryClient.ensureQueryData(listCategoryQueryOption()),
    ]);
  },
  component: Product,
});

function Product() {
  const productCount = useProductCount();
  const categoryCount = useCategoryCount();
  return (
    <div className="flex flex-col p-4" style={{ height: 'calc(100vh - 56px)' }}>
      <h2 className="text-xl font-semibold uppercase">Product</h2>
      <Tabs
        defaultValue="product"
        className="mt-2 w-full"
        style={{
          height: 'calc(100% - 40px)',
        }}
      >
        <TabsList>
          <TabsTrigger value="product" className="flex gap-2 items-center">
            Product
            <Badge variant="outline">{productCount.data}</Badge>
          </TabsTrigger>
          <TabsTrigger value="category" className="flex gap-2 items-center">
            Category
            <Badge variant="outline">{categoryCount.data}</Badge>
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value="product"
          className="rounded-lg shadow-sm h-full p-4 bg-card"
          style={{
            height: 'calc(100% - 50px)',
          }}
        >
          <ProductTable />
        </TabsContent>
        <TabsContent value="category" className="w-full">
          Change your password here.
        </TabsContent>
      </Tabs>
    </div>
  );
}
