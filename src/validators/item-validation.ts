import { z, ZodType } from 'zod';

export class ItemValidation {
  static readonly CREATE: ZodType = z.object({
    name: z.string().trim().min(1).max(100),
    categoryId: z.coerce
      .number()
      .positive({ message: 'Kategori must be selected' }),
    quantity: z.coerce.number().nonnegative().optional(),
    unit: z.string().trim().min(4).max(4).optional(),
    notes: z.string().trim().max(255).optional(),
  });

  static readonly SEARCH: ZodType = z.object({
    name: z.string().trim().min(1).max(100).optional(),
    sku: z.string().min(1).max(7).optional(),
    category: z.string().trim().min(1).max(100).optional(),
    page: z.number().min(1).positive(),
    size: z.number().min(1).positive(),
  });

  static readonly UPDATE: ZodType = z.object({
    name: z.string().trim().min(1).max(100).optional(),
    categoryId: z.coerce.number().positive(),
    quantity: z.coerce.number().nonnegative().optional(),
    unit: z.string().trim().min(4).max(4).optional(),
    notes: z.string().trim().max(255).optional(),
  });
}
