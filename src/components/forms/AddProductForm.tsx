import { useListCategoryQuery } from '@/hooks/queries/categoryQuery';
import { formatToRupiah, parseRupiah } from '@/lib/utils';
import { ProductValidation } from '@/validators/product-validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { DialogFooter } from '../ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useProductAddMutation } from '@/hooks/mutations/product-mutation';
import { categoryKeys, productKeys } from '@/constants/query-keys';
import { useQueryClient } from '@tanstack/react-query';

interface AddProductFormProps {
  setOpen: (state: boolean) => void;
}

const AddProductForm = ({ setOpen }: AddProductFormProps) => {
  const queryClient = useQueryClient();
  const pictureRef = useRef(null);
  const [picture, setPicture] = useState<File | undefined>(undefined);
  const { mutate } = useProductAddMutation();
  const {
    data: { data: categories },
  } = useListCategoryQuery();

  const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setPicture(file);
  };

  const defaultValues = {
    name: '',
    availability: false,
    capital_price: 0,
    price: 0,
    category_id: '',
  };

  const form = useForm<z.infer<typeof ProductValidation.CREATE>>({
    resolver: zodResolver(ProductValidation.CREATE),
    defaultValues,
  });

  function onSubmit(values: z.infer<typeof ProductValidation.CREATE>) {
    const request = { ...values, category_id: Number(values.category_id) };
    const formData = new FormData();
    formData.append('document', JSON.stringify(request));
    formData.append('image', picture ?? '');
    mutate(formData, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: productKeys.all });
        await queryClient.invalidateQueries({ queryKey: categoryKeys.all });
        //   categorySocket.emit('changes');
        setOpen(false);
        //   router.invalidate();
      },
    });
  }

  const isPending = false; // sementara

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
          <Button type="submit" disabled={isPending} className="w-full py-4">
            {isPending ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
export default AddProductForm;
