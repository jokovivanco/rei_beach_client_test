import { itemSocket } from '@/apis/sockets';
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
import { productKeys } from '@/constants/query-keys';
import { useDeleteItemMutation } from '@/hooks/mutations/itemMutation';
import { useProductDeleteMutation } from '@/hooks/mutations/product-mutation';
import { ProductAndPopulatedCategoryResponse } from '@/types/product-types';
import { AlertDialogDescription } from '@radix-ui/react-alert-dialog';
import { useQueryClient } from '@tanstack/react-query';
import { Trash } from 'lucide-react';
import { MouseEvent, useState } from 'react';

interface DeleteProductDialogProps {
  data: ProductAndPopulatedCategoryResponse;
}

const DeleteProductDialog = ({ data }: DeleteProductDialogProps) => {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useProductDeleteMutation();
  const queryClient = useQueryClient();

  function deleteProduct(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    mutate(data.id, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: productKeys.all });
        setOpen(false);
        // itemSocket.emit('changes');
      },
    });
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
            Are you sure want to delete{' '}
            <span className="text-red-500">{data.name}</span>?
          </AlertDialogTitle>
          <AlertDialogDescription
            aria-describedby={undefined}
          ></AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-slate-900 hover:bg-slate-700 hover:text-white text-white">
            No
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              onClick={deleteProduct}
              type="button"
              className="bg-red-600 hover:bg-red-500"
            >
              {isPending ? 'Deleting...' : 'Yes'}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default DeleteProductDialog;
