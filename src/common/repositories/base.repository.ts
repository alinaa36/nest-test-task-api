import { DrizzleService } from 'src/database/services/db.service';
import { and, eq, SQL } from 'drizzle-orm';
import { Injectable } from '@nestjs/common';
import { AnyPgColumn } from 'drizzle-orm/pg-core';

export interface BaseTable {
  id: AnyPgColumn;
}

@Injectable()
export class BaseRepository<
  T extends Record<string, any>,
  TableType extends BaseTable,
> {
  constructor(
    protected readonly dbService: DrizzleService,
    protected readonly table: TableType,
  ) {}

  protected buildWhere(filters: Record<string, any>): SQL | undefined {
    const conditions: SQL[] = [];

    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && key in this.table) {
        conditions.push(eq(this.table[key], value));
      }
    }

    return conditions.length > 0 ? and(...conditions) : undefined;
  }

  async create(data: Partial<T>): Promise<T> {
    const [created] = await this.dbService.db
      .insert(this.table)
      .values(data)
      .returning();
    return created;
  }

  async findById(id: string): Promise<T | null> {
    const [item] = await this.dbService.db
      .select()
      .from(this.table)
      .where(eq(this.table.id, id));
    return item ?? null;
  }

  async update(
    id: string,
    updateData: Partial<T>,
    extraFilters?: Record<string, any>,
  ): Promise<T | null> {
    const whereCondition = this.buildWhere({ id, ...extraFilters });

    const [updated] = await this.dbService.db
      .update(this.table)
      .set(updateData)
      .where(whereCondition!)
      .returning();

    return updated ?? null;
  }

  async delete(id: string, extraFilters?: Record<string, any>) {
    console.log('Deleting with id:', id, 'and filters:', extraFilters);
    const whereCondition = this.buildWhere({ id, ...extraFilters });

    const deleted = this.dbService.db
      .delete(this.table)
      .where(whereCondition!)
      .execute();

    return deleted;
  }
}
