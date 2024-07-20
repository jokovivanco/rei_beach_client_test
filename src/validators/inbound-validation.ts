import { z, ZodType } from 'zod';

export class InboundValidation {
  static readonly CREATE: ZodType = z.object({
    quantity: z.coerce.number().nonnegative().positive(),
    price: z.coerce.number().nonnegative().positive(),
    issued_at: z.coerce.date(),
    itemId: z.coerce
      .number()
      .positive({ message: 'Wajib pilih salah satu barang' }),
  });

  static readonly SEARCH: ZodType = z.object({
    itemName: z.string().trim().min(1).max(100).optional(),
    sku: z.string().min(1).max(7).optional(),
    page: z.number().min(1).positive(),
    size: z.number().min(1).positive(),
  });

  static readonly UPDATE: ZodType = z.object({
    itemId: z.coerce.number().positive(),
    quantity: z.coerce.number().nonnegative().positive().optional(),
    price: z.coerce.number().nonnegative().positive().optional(),
    issued_at: z.coerce.date().optional(),
  });
}
