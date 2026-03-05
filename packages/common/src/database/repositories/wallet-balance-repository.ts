import type { Kysely } from 'kysely';
import { createRow, deleteRow, getRow, getRows } from './utils/kysely-crud-functions';
import type { Database } from '../database';
import type { Selectable } from 'kysely';
import type { Merge } from 'type-fest';

export type WalletBalanceDTO = Selectable<Database['walletBalance']>;

export class WalletBalanceRepository {
  constructor(private readonly db: Kysely<Database>) {}

  async storeWalletBalance(walletId: string, balance: string, timestamp: Date): Promise<WalletBalanceDTO> {
    return createRow(this.db, 'walletBalance', { walletId, balance, timestamp });
  }
}
