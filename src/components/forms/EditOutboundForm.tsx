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
import { useUpdateOutboundMutation } from '@/hooks/mutations/outboundMutation';
import {
  OutboundAndPopulatedItemResponse,
  UpdateOutboundRequest,
} from '@/types/outbound-types';
import { OutboundValidation } from '@/validators/outbound-validation';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { useMemo } from 'react';
import CustomCombobox from '../custom-ui/CustomCombobox';
import DatePicker from '../custom-ui/DatePicker';
import { Button } from '../ui/button';
import { DialogFooter } from '../ui/dialog';
import { AxiosError } from 'axios';
import { useToast } from '../ui/use-toast';
import { outboundSocket } from '@/apis/sockets';

interface EditOutboundFormProps {
  currentData: OutboundAndPopulatedItemResponse;
  setOpen: (state: boolean) => void;
}

const EditOutboundForm = ({ currentData, setOpen }: EditOutboundFormProps) => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useUpdateOutboundMutation();
  const router = useRouter();
  const { toast } = useToast();

  const defaultValues = useMemo(
    () => ({
      itemId: currentData.item.id.toString(),
      sku: currentData.sku,
      issued_at: new Date(currentData.issued_at).toString(),
      quantity: currentData.quantity,
    }),
    [currentData],
  );

  const form = useForm<z.infer<typeof OutboundValidation.UPDATE>>({
    resolver: zodResolver(OutboundValidation.UPDATE),
    defaultValues,
  });

  function onSubmit(values: z.infer<typeof OutboundValidation.UPDATE>) {
    const requestedData: UpdateOutboundRequest = {
      ...values,
      id: currentData.id,
    };

    mutate(requestedData, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ['outbound'] });
        outboundSocket.emit('changes');
        setOpen(false);
        router.invalidate();
      },
      onError: (error) => {
        if (error instanceof AxiosError) {
          toast({
            title: error.response?.data.errors,
            variant: 'destructive',
          });
        }
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
                <FormItem className="flex-1">
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
export default EditOutboundForm;
