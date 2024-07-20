import { z, ZodType } from 'zod';

export class CategoryValidation {
  static readonly CREATE: ZodType = z.object({
    name: z.string().trim().min(1).max(100),
  });

  static readonly SEARCH: ZodType = z.object({
    name: z.string().trim().min(1).max(100).optional(),
    page: z.number().min(1).positive(),
    size: z.number().min(1).positive(),
  });

  static readonly UPDATE: ZodType = z.object({
    name: z.string().trim().min(1).max(100).optional(),
  });
}
