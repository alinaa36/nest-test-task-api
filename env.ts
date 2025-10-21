import z from 'zod';

export const envSchema = z.object({
  PORT: z.coerce.number(),
  POSTGRES_URL: z.string(),
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.coerce.number(),
});

export type Env = z.infer<typeof envSchema>;
