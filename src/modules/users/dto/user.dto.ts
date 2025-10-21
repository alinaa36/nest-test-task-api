import { z } from 'zod';
import { UserRole } from '../enums/role.enum';

export const createUserSchema = z.object({
  email: z.string().email(),
  passwordHash: z.string().min(6),
  name: z.string().min(2),
  role: z.enum(UserRole),
});

export const updateUserSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().min(2).optional(),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;
