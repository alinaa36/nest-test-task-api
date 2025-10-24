import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { DrizzleService } from 'src/database/services/db.service';
import { NotesTable } from 'src/database/schema';
import { NewNote } from '../types/note.type';
import { sql } from 'drizzle-orm';
import { paginate } from 'src/common/utils/pagination.util';

@Injectable()
export class NoteRepository extends BaseRepository<NewNote, typeof NotesTable> {
  constructor(dbService: DrizzleService) {
    super(dbService, NotesTable);
  }

  async findAll(options?: { userId?: string; limit?: number; page?: number }) {
    const where = this.buildWhere({ userId: options?.userId });

    let dataQuery = this.dbService.db.select().from(this.table);
    let countQuery = this.dbService.db
      .select({ count: sql<number>`count(*)` })
      .from(this.table);

    if (where) {
      dataQuery = dataQuery.where(where);
      countQuery = countQuery.where(where);
    }

    if (options?.limit || options?.page) {
      return paginate(
        dataQuery,
        { limit: options.limit, page: options.page },
        countQuery,
      );
    }

    return dataQuery;
  }

  async findByIdWithAccess(id: string, userId?: string) {
    const where = this.buildWhere({ id, userId });

    const [note] = await this.dbService.db
      .select()
      .from(this.table)
      .where(where!);

    return note ?? null;
  }
}
