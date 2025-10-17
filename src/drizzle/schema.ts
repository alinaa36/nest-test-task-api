import { relations } from 'drizzle-orm';
import {
  boolean,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

const createdAt = timestamp('created_at', { withTimezone: true })
  .notNull()
  .defaultNow();
const updatedAt = timestamp('updated_at', { withTimezone: true })
  .notNull()
  .defaultNow()
  .$onUpdate(() => new Date());

export const UsersTable = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).notNull().default('USER'),
  isBlocked: boolean('is_blocked').notNull().default(false),
  createdAt,
  updatedAt,
});

export const NotesTable = pgTable(
  'notes',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    title: varchar('title', { length: 255 }).notNull(),
    content: text('content').notNull(),
    userId: uuid('user_id')
      .notNull()
      .references(() => UsersTable.id, { onDelete: 'cascade' }),
    createdAt,
    updatedAt,
  },
  table => ({
    userIdIdx: index('idx_notes_user_id').on(table.userId),
  }),
);

export const usersRelations = relations(UsersTable, ({ many }) => ({
  notes: many(NotesTable),
}));

export const notesRelations = relations(NotesTable, ({ one }) => ({
  user: one(UsersTable, {
    fields: [NotesTable.userId],
    references: [UsersTable.id],
  }),
}));
