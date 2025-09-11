import type { Kysely } from 'kysely';
import { createRow, getRow, updateRow } from './utils/kysely-crud-functions';
import type { Database } from '../database';
import type { Insertable } from 'kysely';
import type { Selectable } from 'kysely';
import type { Transaction } from 'kysely';
import type { AuthProviderTable } from '../tables/auth-provider-table';
import type { UserTable } from '../tables/user-table';
import type { Updateable } from 'kysely';

export type UserDTO = Selectable<Database['user']>;

export class UserRepository {
  constructor(private readonly db: Kysely<Database>) {}
  async create(user: Insertable<UserTable>, trx?: Transaction<Database>): Promise<UserDTO> {
    return createRow(trx ?? this.db, 'user', user);
  }

  async linkAccount(account: Insertable<AuthProviderTable>) {
    return createRow(this.db, 'authProvider', account);
  }

  async update(id: string, data: Updateable<UserTable>): Promise<UserDTO | undefined> {
    return updateRow(this.db, 'user', { id }, data).executeTakeFirst();
  }

  async get(id: string): Promise<UserDTO | undefined> {
    return getRow(this.db, 'user', { id }).executeTakeFirst();
  }

  async getByEmail(email: string): Promise<UserDTO | undefined> {
    return getRow(this.db, 'user', { email }).executeTakeFirst();
  }

  async getByProvider(provider: string, providerId: string): Promise<UserDTO | undefined> {
    return this.db
      .selectFrom('user')
      .innerJoin('authProvider', 'user.id', 'authProvider.userId')
      .where(eb =>
        eb.and({
          provider,
          providerId,
        }),
      )
      .selectAll('user')
      .executeTakeFirst();
  }
}
