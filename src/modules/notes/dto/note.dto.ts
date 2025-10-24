import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const createNoteSchema = z.object({
  title: z.string(),
  content: z.string(),
});

export const updateNoteSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
});

export class CreateNoteDto extends createZodDto(createNoteSchema) {}
export class UpdateNoteDto extends createZodDto(updateNoteSchema) {}
