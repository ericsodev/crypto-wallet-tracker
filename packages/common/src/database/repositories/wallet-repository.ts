import type { Kysely } from 'kysely';
import { getRow, getRows } from './utils/kysely-crud-functions';
import type { Database } from '../database';
import type { Selectable } from 'kysely';

export type WalletDTO = Selectable<Database['wallet']>;

export class WalletRepository {
  constructor(private readonly db: Kysely<Database>) {}
  async get(id: string): Promise<WalletDTO | undefined> {
    return getRow(this.db, 'wallet', { id });
  }

  async getByUserId(userId: string): Promise<WalletDTO[]> {
    return getRows(this.db, 'wallet', { userId });
  }
}
