import itemService from '@/services/itemService';
import { useMutation } from '@tanstack/react-query';

export const useUpdateItemMutation = () =>
  useMutation({
    mutationFn: itemService.update,
  });

export const useAddItemMutation = () =>
  useMutation({
    mutationFn: itemService.create,
  });

export const useDeleteItemMutation = () =>
  useMutation({
    mutationFn: itemService.remove,
  });
