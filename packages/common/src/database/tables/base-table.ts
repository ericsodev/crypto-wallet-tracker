import type { Generated, ColumnType } from 'kysely';

export interface BaseTable {
  id: Generated<string>;
  createdAt: Generated<Date>;
  updatedAt: Generated<Date>;
  deletedAt: ColumnType<Date | null, null, Date | null>;
}
