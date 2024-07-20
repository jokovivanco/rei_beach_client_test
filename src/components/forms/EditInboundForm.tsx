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
import { formatToRupiah, parseRupiah } from '@/lib/utils';
import {
  InboundAndPopulatedItemResponse,
  UpdateInboundRequest,
} from '@/types/inbound-types';
import { InboundValidation } from '@/validators/inbound-validation';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { useMemo } from 'react';
import CustomCombobox from '../custom-ui/CustomCombobox';
import DatePicker from '../custom-ui/DatePicker';
import { Button } from '../ui/button';
import { DialogFooter } from '../ui/dialog';
import { useUpdateInboundMutation } from '@/hooks/mutations/inboundMutation';
import { inboundSocket } from '@/apis/sockets';

interface EditInboundFormProps {
  currentData: InboundAndPopulatedItemResponse;
  setOpen: (state: boolean) => void;
}

const EditInboundForm = ({ currentData, setOpen }: EditInboundFormProps) => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useUpdateInboundMutation();
  const router = useRouter();

  const defaultValues = useMemo(
    () => ({
      itemId: currentData.item.id.toString(),
      sku: currentData.sku,
      price: currentData.price,
      issued_at: new Date(currentData.issued_at).toString(),
      quantity: currentData.quantity,
    }),
    [currentData],
  );

  const form = useForm<z.infer<typeof InboundValidation.UPDATE>>({
    resolver: zodResolver(InboundValidation.UPDATE),
    defaultValues,
  });

  const price = form.watch('price');
  const quantity = form.watch('quantity');

  const total = useMemo(() => {
    const numPrice = parseFloat(price) || 0;
    const numQuantity = parseFloat(quantity) || 0;
    const total = numPrice * numQuantity;

    return formatToRupiah(total);
  }, [price, quantity]);

  function onSubmit(values: z.infer<typeof InboundValidation.UPDATE>) {
    const requestedData: UpdateInboundRequest = {
      ...values,
      id: currentData.id,
    };

    mutate(requestedData, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ['inbound'] });
        inboundSocket.emit('changes');
        setOpen(false);
        router.invalidate();
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="itemId"
            render={({ field, fieldState }) => {
              return (
                <FormItem>
                  <FormLabel>Nama Barang</FormLabel>
                  <br />
                  <CustomCombobox disabled form={form} field={field} />
                  {fieldState.error && (
                    <FormMessage>{fieldState.error.message}</FormMessage>
                  )}
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="sku"
            render={({ field }) => (
              <FormItem>
                <FormLabel>No. Transaksi (auto)</FormLabel>
                <FormControl>
                  <Input autoComplete="off" type="text" {...field} disabled />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Harga</FormLabel>
                <FormControl>
                  <Input
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
                {fieldState.error && (
                  <FormMessage>{fieldState.error.message}</FormMessage>
                )}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="issued_at"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Tanggal Transaksi</FormLabel>
                <DatePicker field={field} />
                {fieldState.error && (
                  <FormMessage>{fieldState.error.message}</FormMessage>
                )}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="quantity"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Qty</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                {fieldState.error && (
                  <FormMessage>{fieldState.error.message}</FormMessage>
                )}
              </FormItem>
            )}
          />
          <FormItem>
            <FormLabel>Total</FormLabel>
            <Input type="text" inputMode="numeric" value={total} disabled />
          </FormItem>
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
export default EditInboundForm;
