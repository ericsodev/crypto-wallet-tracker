import type { Kysely } from 'kysely';
import { createRow, deleteRow, getRow, getRows } from './utils/kysely-crud-functions';
import type { Database } from '../database';
import type { Selectable } from 'kysely';

export type WalletDTO = Selectable<Database['wallet']>;

export class WalletRepository {
  constructor(private readonly db: Kysely<Database>) {}
  async get(id: string): Promise<WalletDTO | undefined> {
    return getRow(this.db, 'wallet', { id });
  }

  async delete(id: string): Promise<void> {
    await deleteRow(this.db, 'wallet', { id });
  }

  async getByUserId(userId: string): Promise<WalletDTO[]> {
    return getRows(this.db, 'wallet', { userId });
  }

  async createWallet(userId: string, name: string, address: string): Promise<WalletDTO> {
    return createRow(this.db, 'wallet', { address, name, userId });
  }
}
