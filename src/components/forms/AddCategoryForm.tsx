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
import { useAddCategoryMutation } from '@/hooks/mutations/categoryMutation';
import { CategoryValidation } from '@/validators/category-validation';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { Button } from '../ui/button';
import { DialogFooter } from '../ui/dialog';
import { categorySocket } from '@/apis/sockets';

interface AddCategoryFormProps {
  setOpen: (state: boolean) => void;
}

const AddCategoryForm = ({ setOpen }: AddCategoryFormProps) => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useAddCategoryMutation();
  const router = useRouter();

  const defaultValues = {
    name: '',
  };

  const form = useForm<z.infer<typeof CategoryValidation.CREATE>>({
    resolver: zodResolver(CategoryValidation.CREATE),
    defaultValues,
  });

  function onSubmit(values: z.infer<typeof CategoryValidation.CREATE>) {
    mutate(values, {
      onSuccess: async () => {
        queryClient.invalidateQueries({ queryKey: ['general', 'count'] });
        await queryClient.invalidateQueries({ queryKey: ['categories'] });
        categorySocket.emit('changes');
        setOpen(false);
        router.invalidate();
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex w-ful items-center gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <FormItem className="flex-1">
                <FormLabel>Nama Kategori</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    autoComplete="off"
                    placeholder="Nama Kategori"
                    {...field}
                  />
                </FormControl>
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
export default AddCategoryForm;
