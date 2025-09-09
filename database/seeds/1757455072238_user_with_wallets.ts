import type { Kysely } from 'kysely';
import type { Database } from '../../packages/common/src/database/database';

export async function seed(db: Kysely<Database>): Promise<void> {
  await db.deleteFrom('user').execute();
  const user = await db
    .insertInto('user')
    .values({
      email: 'ericso0818@gmail.com',
      name: 'Eric So',
    })
    .returningAll()
    .executeTakeFirstOrThrow();

  // Need to edit this manually after seeding
  await db
    .insertInto('authProvider')
    .values({
      userId: user.id,
      provider: 'Google',
      providerId: 'foobar',
    })
    .execute();

  const [krakenWallet, nanoWallet] = await db
    .insertInto('wallet')
    .values([
      { address: '0x123456', name: 'ETH Kraken Wallet', userId: user.id },

      { address: '0xdeadbeef', name: 'ETH Nano Wallet', userId: user.id },
    ])
    .returningAll()
    .execute();
  if (!krakenWallet) throw new Error('Missing kraken wallet');
  if (!nanoWallet) throw new Error('Missing nano wallet');

  await db
    .insertInto('walletBalance')
    .values([
      {
        timestamp: new Date(),
        balance: '4.832',
        walletId: krakenWallet.id,
      },
      {
        timestamp: new Date(),
        balance: '0.23088',
        walletId: nanoWallet.id,
      },
    ])
    .execute();
}
