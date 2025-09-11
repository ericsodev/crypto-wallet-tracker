import type { FilterObject, Insertable, Kysely } from 'kysely';
import type { Database } from '../../database';
import type { Updateable } from 'kysely';

export const createRow = async <T extends keyof Database>(
  db: Kysely<Database>,
  tableName: T,
  data: Insertable<Database[T]>,
) => {
  return db.insertInto(tableName).values(data).returningAll().executeTakeFirstOrThrow();
};

export const createManyRows = async <T extends keyof Database>(
  db: Kysely<Database>,
  tableName: T,
  data: Insertable<Database[T]>[],
) => {
  return db.insertInto(tableName).values(data).returningAll().execute();
};

export const getRow = <T extends keyof Database>(
  db: Kysely<Database>,
  tableName: T,
  filters: FilterObject<Database, T>,
  includeDeleted?: boolean,
) => {
  return db
    .selectFrom(db.dynamic.table(tableName).as('t'))
    .selectAll()
    .where(eb => eb.and(filters as any))
    .$if(!includeDeleted, qb => qb.where('deletedAt', 'is', null));
};

export const getRows = <T extends keyof Database>(
  db: Kysely<Database>,
  tableName: T,
  filters: FilterObject<Database, T>,
  includeDeleted?: boolean,
) => {
  return db
    .selectFrom(db.dynamic.table(tableName).as('t'))
    .selectAll()
    .where(eb => eb.and(filters as any))
    .$if(!includeDeleted, qb => qb.where('deletedAt', 'is', null));
};

export const updateRow = <T extends keyof Database>(
  db: Kysely<Database>,
  tableName: T,
  filters: FilterObject<Database, T>,
  data: Updateable<Database[T]>,
  includeDeleted?: boolean,
) => {
  return db
    .updateTable(db.dynamic.table(tableName).as('t'))
    .set(data as any)
    .where(eb => eb.and(filters as any))
    .$if(!includeDeleted, qb => qb.where('deletedAt', 'is', null))
    .returningAll();
};

export const deleteRow = <T extends keyof Database>(
  db: Kysely<Database>,
  tableName: T,
  filters: FilterObject<Database, T>,
  includeDeleted?: boolean,
) => {
  return db
    .updateTable(db.dynamic.table(tableName).as('t'))
    .returningAll()
    .set({ deletedAt: new Date() } as any)
    .where(eb => eb.and(filters as any))
    .$if(!includeDeleted, qb => qb.where('deletedAt', 'is', null));
};
