import categoryService from '@/services/categoryService';
import { useMutation } from '@tanstack/react-query';

export const useAddCategoryMutation = () =>
  useMutation({
    mutationFn: categoryService.create,
  });

export const useUpdateCategoryMutation = () =>
  useMutation({
    mutationFn: categoryService.update,
  });

export const useDeleteCategoryMutation = () =>
  useMutation({
    mutationFn: categoryService.remove,
  });
