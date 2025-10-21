import z from "zod";

export const paginationSchema = z.object({
  limit: z.string().transform(Number).optional(),
  page: z.string().transform(Number).optional(),
});

export type PaginationDto = z.infer<typeof paginationSchema>;