import { NotesTable } from 'src/database/schema';

export type NewNote = typeof NotesTable.$inferInsert;
export type Note = typeof NotesTable.$inferSelect;
export type UpdateNote = Partial<NewNote>;
