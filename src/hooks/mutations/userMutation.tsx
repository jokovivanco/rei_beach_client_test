import userService from '@/services/userService';
import { useMutation } from '@tanstack/react-query';

export const useLogin = () =>
  useMutation({
    mutationFn: userService.login,
  });

export const useRegister = () =>
  useMutation({
    mutationFn: userService.register,
  });
