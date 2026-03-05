import type { Insertable, Kysely } from 'kysely';
import { createManyRows, createRow, getRow, getRows } from './utils/kysely-crud-functions';
import type { Database } from '../database';
import type { Selectable } from 'kysely';
import {
  addPaginationFilter,
  getPaginationMetadata,
  PaginationMetadataResponse,
  PaginationParameters,
} from './utils/pagination';
import { postgresTsRange } from './utils/postgres-range-functions';

export type TransactionDTO = Selectable<Database['transaction']>;
export interface TransactionRangeFilters {
  startDate?: Date;
  endDate?: Date;
}

export class TransactionRepository {
  constructor(private readonly db: Kysely<Database>) {}
  async get(id: string): Promise<TransactionDTO | undefined> {
    return getRow(this.db, 'transaction', { id }).executeTakeFirst();
  }

  async getByFilter(filters: Partial<TransactionDTO>): Promise<TransactionDTO[]> {
    return getRows(this.db, 'transaction', filters).execute();
  }

  async listTransactions(
    userId: string,
    pagination: PaginationParameters,
    filters: Partial<TransactionDTO>,
    rangeFilters?: TransactionRangeFilters,
  ): Promise<PaginationMetadataResponse<TransactionDTO[]>> {
    const query = getRows(this.db, 'transaction', { userId })
      .selectAll('t')
      .where(eb => eb.and(filters))
      .$if(!!rangeFilters?.startDate || !!rangeFilters?.endDate, qb =>
        qb.where('t.timestamp', '<@', eb =>
          postgresTsRange(eb.val(rangeFilters?.startDate ?? null), eb.val(rangeFilters?.endDate ?? null)),
        ),
      )
      .$call(qb => addPaginationFilter(qb, pagination, 't.timestamp'));
    console.log(query.compile());
    const metadata = await getPaginationMetadata(query, pagination);

    const data = await query.execute();

    return { data, pagination: metadata };
  }

  async getAllTransactions(
    userId: string,
    filters: Partial<TransactionDTO>,
    rangeFilters?: TransactionRangeFilters,
  ): Promise<TransactionDTO[]> {
    return getRows(this.db, 'transaction', { userId })
      .selectAll('t')
      .where(eb => eb.and(filters))
      .$if(!!rangeFilters?.startDate || !!rangeFilters?.endDate, qb =>
        qb.where('t.timestamp', '<@', eb =>
          postgresTsRange(eb.val(rangeFilters?.startDate ?? null), eb.val(rangeFilters?.endDate ?? null)),
        ),
      )
      .orderBy('t.timestamp', 'desc')
      .execute();
  }

  async createTransaction(transaction: Insertable<Database['transaction']>): Promise<TransactionDTO> {
    return createRow(this.db, 'transaction', transaction);
  }

  async createManyTransactions(transaction: Insertable<Database['transaction']>[]): Promise<TransactionDTO[]> {
    return createManyRows(this.db, 'transaction', transaction);
  }
}
