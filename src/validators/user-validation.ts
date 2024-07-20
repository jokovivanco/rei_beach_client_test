import { role } from '@/types/user-types';
import { z, ZodType } from 'zod';

export class UserValidation {
  static readonly CREATE: ZodType = z.object({
    username: z.string().min(1).max(100),
    password: z.string().min(1).max(100),
    name: z.string().min(1).max(100),
    role: z.enum(role, { message: 'Select either Editor or Admin' }),
  });

  static readonly LOGIN: ZodType = z.object({
    username: z.string().min(1).max(100),
    password: z.string().min(1).max(100),
  });

  static readonly UPDATE_CURRENT: ZodType = z.object({
    name: z.string().min(1).max(100).optional(),
    password: z.string().min(1).max(100).optional(),
    currentPassword: z.string().min(1).max(100),
    role: z.enum(role).optional(),
  });

  static readonly UPDATE: ZodType = z.object({
    username: z.string().min(1).max(100),
    name: z.string().min(1).max(100).optional(),
    password: z.string().min(1).max(100).optional(),
    role: z.enum(role).optional(),
  });
}
