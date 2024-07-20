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
import { useAddOutboundMutation } from '@/hooks/mutations/outboundMutation';
import { useLastOutboundQuery } from '@/hooks/queries/outboundQuery';
import { getNextSku } from '@/lib/utils';
import { OutboundAndPopulatedItemResponse } from '@/types/outbound-types';
import { OutboundValidation } from '@/validators/outbound-validation';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { useMemo } from 'react';
import CustomCombobox from '../custom-ui/CustomCombobox';
import DatePicker from '../custom-ui/DatePicker';
import { Button } from '../ui/button';
import { DialogFooter } from '../ui/dialog';
import { Input } from '../ui/input';
import { AxiosError } from 'axios';
import { useToast } from '../ui/use-toast';
import { outboundSocket } from '@/apis/sockets';

interface AddOutboundFormProps {
  setOpen: (state: boolean) => void;
}

const AddOutboundForm = ({ setOpen }: AddOutboundFormProps) => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useAddOutboundMutation();
  const router = useRouter();
  const { data: lastOutbound } = useLastOutboundQuery();
  const { toast } = useToast();

  const hasSku = (
    data: OutboundAndPopulatedItemResponse,
  ): data is OutboundAndPopulatedItemResponse => {
    return data && typeof data.sku === 'string';
  };

  const defaultValues = useMemo(
    () => ({
      itemId: '',
      sku: hasSku(lastOutbound.data)
        ? getNextSku(lastOutbound.data.sku as string)
        : 'BK00001',
      issued_at: new Date().toString(),
      quantity: 0,
    }),
    [lastOutbound.data],
  );

  const form = useForm<z.infer<typeof OutboundValidation.CREATE>>({
    resolver: zodResolver(OutboundValidation.CREATE),
    defaultValues,
  });

  function onSubmit(values: z.infer<typeof OutboundValidation.CREATE>) {
    mutate(values, {
      onSuccess: async () => {
        queryClient.invalidateQueries({ queryKey: ['general', 'count'] });
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
                  <CustomCombobox form={form} field={field} />
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
export default AddOutboundForm;
