import { outboundSocket } from '@/apis/sockets';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useDeleteOutboundMutation } from '@/hooks/mutations/outboundMutation';
import { OutboundAndPopulatedItemResponse } from '@/types/outbound-types';
import { AlertDialogDescription } from '@radix-ui/react-alert-dialog';
import { useQueryClient } from '@tanstack/react-query';
import { Trash } from 'lucide-react';
import { MouseEvent, useState } from 'react';

interface DeleteOutboundDialogProps {
  data: OutboundAndPopulatedItemResponse;
}

const DeleteOutboundDialog = ({ data }: DeleteOutboundDialogProps) => {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useDeleteOutboundMutation();
  const queryClient = useQueryClient();

  function deleteItem(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    mutate(
      {
        itemId: data.item.id,
        id: data.id,
      },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries({ queryKey: ['outbound'] });
          outboundSocket.emit('changes');
          setOpen(false);
        },
      },
    );
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button className="flex gap-1 items-center bg-red-600 hover:bg-red-500">
          <Trash size={16} />
          <span>Hapus</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Anda yakin ingin menghapus No. Transaksi{' '}
            <span className="text-red-500">{data.sku}</span>?
          </AlertDialogTitle>
          <AlertDialogDescription
            aria-describedby={undefined}
          ></AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-slate-900 hover:bg-slate-700 hover:text-white text-white">
            Tidak
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              onClick={deleteItem}
              type="button"
              className="bg-red-600 hover:bg-red-500"
            >
              {isPending ? 'Sedang Menghapus...' : 'Ya'}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default DeleteOutboundDialog;
