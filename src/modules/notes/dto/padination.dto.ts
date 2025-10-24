import { createZodDto } from "nestjs-zod";
import z from "zod";

export const paginationSchema = z.object({
  limit: z.string().transform(Number).optional(),
  page: z.string().transform(Number).optional(),
});

export class PaginationDto extends createZodDto(paginationSchema) {}
