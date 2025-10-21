import z from 'zod';

export const filterUsersSchema = z.object({
  name: z.string().optional(),
  isBlocked: z.preprocess(val => {
    if (val === 'true') return true;
    if (val === 'false') return false;
    return val;
  }, z.boolean().optional()),
});

export const IdParamSchema = z.object({
  id: z.string().uuid({ message: 'Invalid user ID format' }),
});

export type FilterUsersDto = z.infer<typeof filterUsersSchema>;
export type IdParamDto = z.infer<typeof IdParamSchema>;
