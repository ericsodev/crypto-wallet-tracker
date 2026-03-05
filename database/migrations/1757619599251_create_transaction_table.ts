import { sql, type Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('transaction')
    .addColumn('id', 'uuid', col => col.defaultTo(sql`gen_random_uuid()`).primaryKey())
    .addColumn('createdAt', 'timestamptz', col => col.notNull().defaultTo(sql`current_timestamp`))
    .addColumn('updatedAt', 'timestamptz', col => col.notNull().defaultTo(sql`current_timestamp`))
    .addColumn('deletedAt', 'timestamptz')
    .addColumn('userId', 'uuid', col => col.notNull().references('user.id').onDelete('cascade'))
    .addColumn('walletId', 'uuid', col => col.notNull().references('wallet.id').onDelete('cascade'))
    .addColumn('type', 'varchar(31)', col => col.notNull())
    .addColumn('timestamp', 'timestamptz', col => col.notNull())
    .addColumn('blockNumber', 'integer', col => col.notNull())
    .addColumn('hash', 'varchar', col => col.notNull())
    .addColumn('amount', 'varchar', col => col.notNull())
    .addColumn('fee', 'varchar', col => col.notNull())
    .addColumn('senderAddress', 'varchar', col => col.notNull())
    .addColumn('recipientAddress', 'varchar', col => col.notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('transaction').execute();
}
