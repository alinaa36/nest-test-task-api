import { DrizzleService } from 'src/database/services/db.service';
import { NewNote, UpdateNote } from '../types/note.type';
import { NotesTable } from 'src/database/schema';
import { eq, sql } from 'drizzle-orm';
import { paginate } from 'src/common/utils/pagination.util';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NoteRepository {
  constructor(private readonly dbService: DrizzleService) {}

  async createNote(note: NewNote) {
    const createdNote = await this.dbService.db
      .insert(NotesTable)
      .values(note)
      .returning();
    return createdNote;
  }

  async findNoteById(noteId: string) {
    const note = await this.dbService.db
      .select()
      .from(NotesTable)
      .where(eq(NotesTable.id, noteId));
    return note[0] ?? null;
  }

  async findAllNotes(limit?: number, page?: number) {
    const dataQuery = this.dbService.db.select().from(NotesTable);
    const countQuery = this.dbService.db
      .select({ count: sql<number>`count(*)` })
      .from(NotesTable);

    return paginate(dataQuery, { page, limit }, countQuery);
  }

  async findNotesByUserId(userId: string, limit?: number, page?: number) {
    const dataQuery = this.dbService.db
      .select()
      .from(NotesTable)
      .where(eq(NotesTable.userId, userId));

    const countQuery = this.dbService.db
      .select({ count: sql<number>`count(*)` })
      .from(NotesTable)
      .where(eq(NotesTable.userId, userId));

    return paginate(dataQuery, { page, limit }, countQuery);
  }

  async updateNote(noteId: string, updateData: UpdateNote) {
    const updateNote = await this.dbService.db
      .update(NotesTable)
      .set(updateData)
      .where(eq(NotesTable.id, noteId))
      .returning();
    return updateNote;
  }

  async deleteNote(noteId: string) {
    return await this.dbService.db
      .delete(NotesTable)
      .where(eq(NotesTable.id, noteId))
      .execute();
  }
}
