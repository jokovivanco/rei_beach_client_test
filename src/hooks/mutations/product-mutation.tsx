import ProductService from '@/services/product-service';
import { useMutation } from '@tanstack/react-query';

export const useProductAddMutation = () =>
  useMutation({
    mutationFn: ProductService.create,
  });

export const useProductEditMutation = () =>
  useMutation({
    mutationFn: ProductService.update,
  });

export const useProductDeleteMutation = () =>
  useMutation({
    mutationFn: ProductService.remove,
  });
