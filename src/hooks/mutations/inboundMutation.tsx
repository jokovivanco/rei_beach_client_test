import inboundService from '@/services/inboundService';
import { useMutation } from '@tanstack/react-query';

export const useAddInboundMutation = () =>
  useMutation({
    mutationFn: inboundService.create,
  });

export const useUpdateInboundMutation = () =>
  useMutation({
    mutationFn: inboundService.update,
  });

export const useDeleteInboundMutation = () =>
  useMutation({
    mutationFn: inboundService.remove,
  });
