import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { DrizzleService } from 'src/database/services/db.service';
import { UsersTable } from 'src/database/schema';
import { NewUser } from '../types/user.type';
import { FilterUsersDto } from '../dto/filter-users.dto';
import { and, eq, ilike } from 'drizzle-orm';

@Injectable()
export class UserRepository extends BaseRepository<NewUser, typeof UsersTable> {
  constructor(dbService: DrizzleService) {
    super(dbService, UsersTable);
  }

  async findAll(filter: FilterUsersDto) {
    const conditions = [];

    if (filter.name) {
      conditions.push(ilike(this.table.name, `%${filter.name}%`));
    }

    if (typeof filter.isBlocked === 'boolean') {
      conditions.push(eq(this.table.isBlocked, filter.isBlocked));
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    let query = this.dbService.db.select().from(this.table);
    if (where) query = query.where(where);

    return query;
  }

  async findByEmail(email: string) {
    const where = this.buildWhere({ email });

    const [user] = await this.dbService.db
      .select()
      .from(this.table)
      .where(where!);

    return user ?? null;
  }
}
