import type { Kysely } from 'kysely';
import { createRow, deleteRow, getRow, getRows } from './utils/kysely-crud-functions';
import type { Database } from '../database';
import type { Selectable } from 'kysely';
import type { Merge } from 'type-fest';

export type WalletDTO = Selectable<Database['wallet']>;
export type WalletDetail = Merge<Selectable<Database['wallet']>, { balance?: string | null; numTransactions: string }>;

export class WalletRepository {
  constructor(private readonly db: Kysely<Database>) {}
  async get(id: string): Promise<WalletDTO | undefined> {
    return getRow(this.db, 'wallet', { id }).executeTakeFirst();
  }

  async delete(id: string): Promise<void> {
    deleteRow(this.db, 'wallet', { id }).execute();
  }

  async listByUserId(
    userId: string,
    orderBy: 'name' | 'createdAt' = 'name',
    orderDirection: 'asc' | 'desc' = 'asc',
  ): Promise<WalletDetail[]> {
    return getRows(this.db, 'wallet', { userId })
      .orderBy(orderBy, orderDirection)
      .select(qb =>
        qb
          .selectFrom('walletBalance')
          .whereRef('walletBalance.walletId', '=', 't.id')
          .select('walletBalance.balance')
          .orderBy('timestamp', 'desc')
          .limit(1)
          .as('balance'),
      )
      .select(qb =>
        qb
          .selectFrom('transaction')
          .where('deletedAt', 'is', null)
          .where('walletId', '=', eb => eb.ref('t.id'))
          .select(eb => eb.fn.countAll('transaction').$castTo<string>().as('count'))
          .$asScalar()
          .as('numTransactions'),
      )
      .execute();
  }

  async createWallet(userId: string, name: string, address: string): Promise<WalletDTO> {
    return createRow(this.db, 'wallet', { address, name, userId });
  }
}
