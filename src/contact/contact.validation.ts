import { z } from 'zod';

export class ContactValidation {
  static readonly CREATE = z.object({
    firstName: z.string().min(1).max(100),
    lastName: z.string().min(1).max(100).optional(),
    email: z.string().min(1).max(100).email().optional(),
    phone: z.string().min(1).max(20).optional(),
  });
}