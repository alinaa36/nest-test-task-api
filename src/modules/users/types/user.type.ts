import { UsersTable } from 'src/database/schema';

export type NewUser = typeof UsersTable.$inferInsert;
export type User = typeof UsersTable.$inferSelect;
export type UpdateUser = Partial<NewUser>;
