import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const filterUsersSchema = z.object({
  name: z.string().optional(),
  isBlocked: z.preprocess(val => {
    if (val === undefined || val === null || val === '--') return undefined;
    if (val === 'true') return true;
    if (val === 'false') return false;
    return val;
  }, z.boolean().optional()),
});

export const IdParamSchema = z.object({
  id: z.string().uuid({ message: 'Invalid user ID format' }),
});

export class FilterUsersDto extends createZodDto(filterUsersSchema) {}
export class IdParamDto extends createZodDto(IdParamSchema) {}
