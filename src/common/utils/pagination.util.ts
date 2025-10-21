// paginate.ts
import { sql } from 'drizzle-orm';

export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  page?: number;
  limit?: number;
  total?: number;
}

export async function paginate<T>(
  dataQueryBuilder: any,
  options: PaginationOptions = {},
  countQueryBuilder?: any,
): Promise<PaginatedResult<T>> {
  const { page, limit } = options;

  if (page && limit) {
    const offset = (page - 1) * limit;

    const totalResult = countQueryBuilder
      ? await countQueryBuilder.execute()
      : await dataQueryBuilder
          .select({ count: sql<number>`count(*)` })
          .execute();

    const total = totalResult[0]?.count ?? 0;

    const dataQuery = dataQueryBuilder;
    const data = await dataQuery.limit(limit).offset(offset).execute();

    return { data, page, limit, total };
  } else {
    const data = await dataQueryBuilder.execute();
    return { data };
  }
}
