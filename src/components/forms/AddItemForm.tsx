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
import { Button } from '../ui/button';
import { ItemValidation } from '@/validators/item-validation';
import { useListCategoryQuery } from '@/hooks/queries/categoryQuery';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useAddItemMutation } from '@/hooks/mutations/itemMutation';
import { useRouter } from '@tanstack/react-router';
import { DialogFooter } from '../ui/dialog';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { getNextSku } from '@/lib/utils';
import { useLastItemQuery } from '@/hooks/queries/itemQuery';
import { ItemAndPopulatedCategoryResponse } from '@/types/item-types';
import { itemSocket } from '@/apis/sockets';

interface AddItemFormProps {
  setOpen: (state: boolean) => void;
}

const AddItemForm = ({ setOpen }: AddItemFormProps) => {
  const queryClient = useQueryClient();
  const {
    data: { data: categories },
  } = useListCategoryQuery();
  const { mutate, isPending } = useAddItemMutation();
  const router = useRouter();
  const { data: lastItem } = useLastItemQuery();

  const [qtyValidationErrorMessage, setQtyValidationErrorMessage] =
    useState('');
  const [unitValidationErrorMessage, setUnitValidationErrorMessage] =
    useState('');

  const hasSku = (
    data: ItemAndPopulatedCategoryResponse,
  ): data is ItemAndPopulatedCategoryResponse => {
    return data && typeof data.sku === 'string';
  };

  const defaultValues = useMemo(
    () => ({
      sku: hasSku(lastItem.data)
        ? getNextSku(lastItem.data.sku as string)
        : 'BR00001',
      name: '',
      quantity: '0',
      categoryId: '',
      unit: 'Each',
      notes: '',
    }),
    [lastItem.data],
  );

  const form = useForm<z.infer<typeof ItemValidation.CREATE>>({
    resolver: zodResolver(ItemValidation.CREATE),
    defaultValues,
  });

  function onSubmit(values: z.infer<typeof ItemValidation.CREATE>) {
    mutate(values, {
      onSuccess: async () => {
        queryClient.invalidateQueries({ queryKey: ['general', 'count'] });
        await queryClient.invalidateQueries({ queryKey: ['items'] });
        itemSocket.emit('changes');
        setOpen(false);
        router.invalidate();
      },
    });
  }

  useEffect(() => {
    const qtyError = form.formState.errors.quantity?.message;
    const unitError = form.formState.errors.unit?.message;
    setQtyValidationErrorMessage(typeof qtyError === 'string' ? qtyError : '');
    setUnitValidationErrorMessage(
      typeof unitError === 'string' ? unitError : '',
    );
  }, [form.formState.errors.quantity, form.formState.errors.unit]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="sku"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ID Barang (auto)</FormLabel>
                <FormControl>
                  <Input autoComplete="off" type="text" {...field} disabled />
                </FormControl>
              </FormItem>
            )}
          />
          <div>
            <div className="flex gap-1">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Qty</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem className="self-end w-20">
                    <FormLabel>Satuan</FormLabel>
                    <FormControl>
                      <Input autoComplete="off" type="text" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="mt-2">
              {qtyValidationErrorMessage && (
                <p className="text-sm font-medium text-destructive">
                  {qtyValidationErrorMessage}
                </p>
              )}
              {unitValidationErrorMessage && (
                <p className="text-sm font-medium text-destructive">
                  {unitValidationErrorMessage}
                </p>
              )}
            </div>
          </div>
          <FormField
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Nama Barang</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="off"
                    type="text"
                    placeholder="Nama Barang"
                    {...field}
                  />
                </FormControl>
                {fieldState.error && (
                  <FormMessage>{fieldState.error.message}</FormMessage>
                )}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="notes"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Catatan (optional)</FormLabel>
                <FormControl>
                  <Input autoComplete="off" type="text" {...field} />
                </FormControl>
                {fieldState.error && (
                  <FormMessage>{fieldState.error.message}</FormMessage>
                )}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field, fieldState }) => {
              return (
                <FormItem>
                  <FormLabel>Kategori</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        form.setValue('categoryId', value);
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Kategori" />
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
                  {fieldState.error && (
                    <FormMessage>{fieldState.error.message}</FormMessage>
                  )}
                </FormItem>
              );
            }}
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
export default AddItemForm;
