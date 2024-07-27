import { z, ZodType } from 'zod';

export class ProductValidation {
  static readonly CREATE: ZodType = z.object({
    name: z.string().min(1).max(100),
    availability: z.boolean(),
    price: z.number().nonnegative(),
    capital_price: z.number().nonnegative(),
    category_id: z.string().min(1),
  });

  static readonly SEARCH: ZodType = z.object({
    name: z.string().max(100).optional(),
    category: z.number().array().optional(),
    size: z.number().min(1).positive(),
    cursor: z.number().optional(),
  });

  static readonly UPDATE: ZodType = this.CREATE;
}
