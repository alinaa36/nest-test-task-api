import { z } from 'zod';
import { UserRole } from '../enums/role.enum';
import { createZodDto } from 'nestjs-zod';

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

export class CreateUserDto extends createZodDto(createUserSchema) {}
export class UpdateUserDto extends createZodDto(updateUserSchema) {}
