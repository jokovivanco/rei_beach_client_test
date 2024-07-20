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
import { useUpdateCategoryMutation } from '@/hooks/mutations/categoryMutation';
import {
  CategoryAndPopulatedItemsResponse,
  UpdateCategoryRequest,
} from '@/types/category-types';
import { CategoryValidation } from '@/validators/category-validation';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { useMemo } from 'react';
import { Button } from '../ui/button';
import { DialogFooter } from '../ui/dialog';
import { categorySocket } from '@/apis/sockets';

interface EditCategoryForm {
  currentData: CategoryAndPopulatedItemsResponse;
  setOpen: (state: boolean) => void;
}

const EditCategoryForm = ({ currentData, setOpen }: EditCategoryForm) => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useUpdateCategoryMutation();
  const router = useRouter();

  const defaultValues = useMemo(
    () => ({
      name: currentData.name,
    }),
    [currentData],
  );

  const form = useForm<z.infer<typeof CategoryValidation.UPDATE>>({
    resolver: zodResolver(CategoryValidation.UPDATE),
    defaultValues,
  });

  function onSubmit(values: z.infer<typeof CategoryValidation.UPDATE>) {
    const requestedData: UpdateCategoryRequest = {
      ...values,
      id: currentData.id,
    };

    mutate(requestedData, {
      onSuccess: async () => {
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
        <FormField
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <FormItem className="w-full">
              <FormLabel>Kategori</FormLabel>
              <FormControl>
                <Input
                  autoComplete="off"
                  type="text"
                  placeholder="Kategori"
                  {...field}
                />
              </FormControl>
              {fieldState.error && (
                <FormMessage>{fieldState.error.message}</FormMessage>
              )}
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button type="submit" disabled={isPending} className="w-full py-4">
            {isPending ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
export default EditCategoryForm;
