import type { Kysely } from 'kysely';
import { createRow, deleteRow, getRow, getRows } from './utils/kysely-crud-functions';
import type { Database } from '../database';
import type { Selectable } from 'kysely';
import type { Merge } from 'type-fest';

export type WalletDTO = Selectable<Database['wallet']>;
export type WalletWithRecentBalanceDTO = Merge<Selectable<Database['wallet']>, { balance?: string | null }>;

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
  ): Promise<WalletWithRecentBalanceDTO[]> {
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
      .execute();
  }

  async createWallet(userId: string, name: string, address: string): Promise<WalletDTO> {
    return createRow(this.db, 'wallet', { address, name, userId });
  }
}
