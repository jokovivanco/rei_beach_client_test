import outboundService from '@/services/outboundService';
import { useMutation } from '@tanstack/react-query';

export const useAddOutboundMutation = () =>
  useMutation({
    mutationFn: outboundService.create,
  });

export const useUpdateOutboundMutation = () =>
  useMutation({
    mutationFn: outboundService.update,
  });

export const useDeleteOutboundMutation = () =>
  useMutation({
    mutationFn: outboundService.remove,
  });
