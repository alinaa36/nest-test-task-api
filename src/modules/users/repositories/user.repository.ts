import { DrizzleService } from 'src/database/services/db.service';
import { NewUser, UpdateUser } from '../types/user.type';
import { UsersTable } from 'src/database/schema';
import { Injectable } from '@nestjs/common';
import { and, eq, ilike } from 'drizzle-orm';
import { FilterUsersDto } from '../dto/filter-users.dto';

@Injectable()
export class UserRepository {
  constructor(private readonly dbServise: DrizzleService) {}

  async createUser(newUser: NewUser) {
    const user = await this.dbServise.db
      .insert(UsersTable)
      .values(newUser)
      .returning();

    return user[0];
  }

  async findUser(userId: string) {
    const user = await this.dbServise.db
      .select()
      .from(UsersTable)
      .where(eq(UsersTable.id, userId));

    return user[0] ?? null;
  }

  async findByEmail(emailUser: string) {
    const user = await this.dbServise.db
      .select()
      .from(UsersTable)
      .where(eq(UsersTable.email, emailUser));
    return user[0] ?? null;
  }

  async findAll(filter: FilterUsersDto) {
    let conditions = [];

    if (filter.name) {
      conditions.push(ilike(UsersTable.name, `%${filter.name}%`));
    }

    if (typeof filter.isBlocked === 'boolean') {
      conditions.push(eq(UsersTable.isBlocked, filter.isBlocked));
    }

    let query = this.dbServise.db.select().from(UsersTable);

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const users = await query;
    return users;
  }

  async updateUser(userId: string, updateData: UpdateUser) {
    const user = await this.dbServise.db
      .update(UsersTable)
      .set(updateData)
      .where(eq(UsersTable.id, userId))
      .returning();

    return user;
  }

  async deleteUser(userId: string) {
    return await this.dbServise.db
      .delete(UsersTable)
      .where(eq(UsersTable.id, userId))
      .execute();
  }
}
