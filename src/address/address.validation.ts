import { z } from 'zod';

export class AddressValidation {
  static readonly CREATE = z.object({
    contactId: z.number().positive().min(1),
    street: z.string().min(1).max(255).optional(), // min 1, supaya tidak terima string kosong, karena string kosong != null di db
    city: z.string().min(1).max(100).optional(),
    province: z.string().min(1).max(100).optional(),
    country: z.string().min(1).max(100),
    postalCode: z.string().min(1).max(10),
  });

  static readonly GET = z.object({
    contactId: z.number().positive().min(1),
    addressId: z.number().positive().min(1),
  });
}
