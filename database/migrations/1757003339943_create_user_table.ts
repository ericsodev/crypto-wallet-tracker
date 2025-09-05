import { sql, type Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('user')
    .addColumn('id', 'uuid', col => col.defaultTo(sql`gen_random_uuid()`).primaryKey())
    .addColumn('createdAt', 'timestamptz', col => col.notNull().defaultTo(sql`current_timestamp`))
    .addColumn('updatedAt', 'timestamptz', col => col.notNull().defaultTo(sql`current_timestamp`))
    .addColumn('deletedAt', 'timestamptz')
    .addColumn('name', 'varchar(63)', col => col.notNull().check(sql`LENGTH(name) > 0`))
    .addColumn('email', 'varchar(255)', col => col.notNull().check(sql`LENGTH(email) > 0`))
    .execute();

  await db.schema
    .createTable('authProvider')
    .addColumn('id', 'uuid', col => col.defaultTo(sql`gen_random_uuid()`).primaryKey())
    .addColumn('createdAt', 'timestamptz', col => col.notNull().defaultTo(sql`current_timestamp`))
    .addColumn('updatedAt', 'timestamptz', col => col.notNull().defaultTo(sql`current_timestamp`))
    .addColumn('deletedAt', 'timestamptz')
    .addColumn('userId', 'uuid', col => col.notNull().references('user.id'))
    .addColumn('provider', 'varchar(15)', col => col.notNull())
    .addColumn('providerId', 'varchar(255)', col => col.notNull())
    .execute();

  await db.schema
    .createIndex('auth_provider_user_id')
    .on('authProvider')
    .unique()
    .columns(['userId', 'provider'])
    // @ts-ignore
    .where('deletedAt', 'is', null)
    .execute();

  await db.schema
    .createIndex('auth_provider_provider_id')
    .on('authProvider')
    .columns(['provider', 'providerId'])
    // @ts-ignore
    .where('deletedAt', 'is', null)
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropIndex('auth_provider_provider_id').ifExists().execute();
  await db.schema.dropIndex('auth_provider_user_id').ifExists().execute();
  await db.schema.dropTable('authProvider').ifExists().execute();
  await db.schema.dropTable('user').ifExists().execute();
}
