import { sql, type Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('wallet_balance')
    .addColumn('id', 'uuid', col => col.defaultTo(sql`gen_random_uuid()`).primaryKey())
    .addColumn('createdAt', 'timestamptz', col => col.notNull().defaultTo(sql`current_timestamp`))
    .addColumn('updatedAt', 'timestamptz', col => col.notNull().defaultTo(sql`current_timestamp`))
    .addColumn('deletedAt', 'timestamptz')
    .addColumn('walletId', 'uuid', col => col.notNull().references('wallet.id').onDelete('cascade'))
    .addColumn('balance', 'varchar', col => col.notNull().check(sql`LENGTH(balance) > 0`))
    .addColumn('timestamp', 'timestamptz', col => col.notNull())
    .execute();

  await db.schema.createIndex('wallet_balance_wallet_id').on('wallet_balance').columns(['walletId']).execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('wallet_balance_wallet_id').execute();
  await db.schema.dropTable('wallet_balance').execute();
}
