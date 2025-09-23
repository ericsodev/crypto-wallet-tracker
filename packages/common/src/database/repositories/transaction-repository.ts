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

export type TransactionDTO = Selectable<Database['transaction']>;

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
  ): Promise<PaginationMetadataResponse<TransactionDTO[]>> {
    console.log('filters', filters);
    const query = getRows(this.db, 'transaction', { userId })
      .selectAll('t')
      .where(eb => eb.and(filters))
      .$call(qb => addPaginationFilter(qb, pagination, 't.timestamp'));
    const metadata = await getPaginationMetadata(query, pagination);

    const data = await query.execute();
    console.log(data, metadata);

    return { data, pagination: metadata };
  }

  async createTransaction(transaction: Insertable<Database['transaction']>): Promise<TransactionDTO> {
    return createRow(this.db, 'transaction', transaction);
  }

  async createManyTransactions(transaction: Insertable<Database['transaction']>[]): Promise<TransactionDTO[]> {
    return createManyRows(this.db, 'transaction', transaction);
  }
}
