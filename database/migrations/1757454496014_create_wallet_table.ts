import { sql, type Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('wallet')
    .addColumn('id', 'uuid', col => col.defaultTo(sql`gen_random_uuid()`).primaryKey())
    .addColumn('createdAt', 'timestamptz', col => col.notNull().defaultTo(sql`current_timestamp`))
    .addColumn('updatedAt', 'timestamptz', col => col.notNull().defaultTo(sql`current_timestamp`))
    .addColumn('deletedAt', 'timestamptz')
    .addColumn('userId', 'uuid', col => col.notNull().references('user.id').onDelete('cascade'))
    .addColumn('name', 'varchar(63)', col => col.notNull().check(sql`LENGTH(name) > 0`))
    .addColumn('address', 'varchar(255)', col => col.notNull().check(sql`LENGTH(address) > 0`))
    .addColumn('parentId', 'uuid', col => col.references('wallet.id').onDelete('cascade'))
    .execute();

  await db.schema.createIndex('wallet_user_id_index').columns(['userId']).on('wallet').execute();
  await db.schema
    .createIndex('wallet_name_user_id_unique')
    .columns(['userId', 'name'])
    // @ts-expect-error
    .where('deletedAt', 'is', null)
    .unique()
    .on('wallet')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropIndex('wallet_user_id_index').execute();
  await db.schema.dropTable('wallet').execute();
}
