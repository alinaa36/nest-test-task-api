import z from 'zod';

export const createNoteSchema = z.object({
  title: z.string(),
  content: z.string(),
});

export const updateNoteSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
});

export type CreateNoteDto = z.infer<typeof createNoteSchema>;
export type UpdateNoteDto = z.infer<typeof updateNoteSchema>;
