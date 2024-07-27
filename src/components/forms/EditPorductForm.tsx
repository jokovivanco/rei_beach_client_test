import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { categoryKeys, productKeys } from '@/constants/query-keys';
import { useProductEditMutation } from '@/hooks/mutations/product-mutation';
import { useListCategoryQuery } from '@/hooks/queries/categoryQuery';
import { formatToRupiah, parseRupiah } from '@/lib/utils';
import {
  ProductAndPopulatedCategoryResponse,
  UpdateProductRequest,
} from '@/types/product-types';
import { ProductValidation } from '@/validators/product-validation';
import { useQueryClient } from '@tanstack/react-query';
import { useMemo, useRef, useState } from 'react';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { DialogFooter } from '../ui/dialog';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

interface EditProductFormProps {
  currentData: ProductAndPopulatedCategoryResponse;
  setOpen: (state: boolean) => void;
}

const EditProductForm = ({ currentData, setOpen }: EditProductFormProps) => {
  const queryClient = useQueryClient();
  const pictureRef = useRef(null);
  const [picture, setPicture] = useState<File | undefined>(undefined);
  const {
    data: { data: categories },
  } = useListCategoryQuery();
  const { mutate } = useProductEditMutation();

  const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setPicture(file);
  };

  const defaultValues = useMemo(
    () => ({
      name: currentData.name,
      availability: currentData.availability,
      capital_price: currentData.capital_price,
      price: currentData.price,
      category_id: currentData.category_id.toString(),
    }),
    [currentData],
  );

  const form = useForm<z.infer<typeof ProductValidation.UPDATE>>({
    resolver: zodResolver(ProductValidation.UPDATE),
    defaultValues,
  });

  function onSubmit(values: z.infer<typeof ProductValidation.UPDATE>) {
    const request = {
      ...values,
      id: currentData.id,
      category_id: Number(values.category_id),
      image_url: currentData?.image_url || '',
    } as UpdateProductRequest;
    const formData = new FormData();
    formData.append('document', JSON.stringify(request));
    formData.append('image', picture ?? '');
    mutate(formData, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: productKeys.all });
        await queryClient.invalidateQueries({ queryKey: categoryKeys.all });
        setOpen(false);
        //   categorySocket.emit('changes');
        //   router.invalidate();
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <FormItem>
              <div className="flex gap-2 items-center justify-between">
                <FormLabel className="whitespace-nowrap">
                  Product Name
                </FormLabel>
                <FormControl>
                  <Input
                    className="max-w-[300px]"
                    type="text"
                    autoComplete="off"
                    placeholder="Product name"
                    {...field}
                  />
                </FormControl>
              </div>
              {fieldState.error && (
                <FormMessage className="text-end">
                  {fieldState.error.message}
                </FormMessage>
              )}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="availability"
          render={({ field, fieldState }) => (
            <FormItem>
              <div className="flex gap-2 items-center justify-between">
                <FormLabel className="whitespace-nowrap">
                  Availability
                </FormLabel>
                <FormControl>
                  <div className="w-full max-w-[300px]">
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </div>
                </FormControl>
              </div>
              {fieldState.error && (
                <FormMessage className="text-end">
                  {fieldState.error.message}
                </FormMessage>
              )}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="capital_price"
          render={({ field, fieldState }) => (
            <FormItem>
              <div className="flex gap-2 items-center justify-between">
                <FormLabel className="whitespace-nowrap">
                  Capital Price
                </FormLabel>
                <FormControl>
                  <Input
                    className="max-w-[300px]"
                    value={formatToRupiah(field.value)}
                    onChange={(e) => {
                      const numericValue = parseRupiah(e.target.value);
                      field.onChange(numericValue);
                    }}
                    onBlur={() => {
                      const formattedValue = formatToRupiah(field.value);
                      (document.activeElement as HTMLInputElement).value =
                        formattedValue;
                    }}
                  />
                </FormControl>
              </div>
              {fieldState.error && (
                <FormMessage className="text-end">
                  {fieldState.error.message}
                </FormMessage>
              )}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field, fieldState }) => (
            <FormItem>
              <div className="flex gap-2 items-center justify-between">
                <FormLabel className="whitespace-nowrap">
                  Selling Price
                </FormLabel>
                <FormControl>
                  <Input
                    className="max-w-[300px]"
                    value={formatToRupiah(field.value)}
                    onChange={(e) => {
                      const numericValue = parseRupiah(e.target.value);
                      field.onChange(numericValue);
                    }}
                    onBlur={() => {
                      const formattedValue = formatToRupiah(field.value);
                      (document.activeElement as HTMLInputElement).value =
                        formattedValue;
                    }}
                  />
                </FormControl>
              </div>
              {fieldState.error && (
                <FormMessage className="text-end">
                  {fieldState.error.message}
                </FormMessage>
              )}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category_id"
          render={({ field, fieldState }) => (
            <FormItem>
              <div className="flex gap-2 items-center justify-between">
                <FormLabel className="whitespace-nowrap">Category</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      form.setValue('category_id', value);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="max-w-[300px]">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id.toString()}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
              </div>
              {fieldState.error && (
                <FormMessage className="text-end">
                  {fieldState.error.message}
                </FormMessage>
              )}
            </FormItem>
          )}
        />
        <div className="flex gap-2 items-center justify-between">
          <Label htmlFor="picture">Picture</Label>
          <Input
            ref={pictureRef}
            type="file"
            className="max-w-[300px]"
            onChange={handlePictureChange}
          />
        </div>

        <DialogFooter>
          <Button type="submit" disabled={false} className="w-full py-4">
            {false ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
export default EditProductForm;
