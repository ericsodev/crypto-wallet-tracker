import { Kysely, PostgresDialect } from 'kysely';
import type { Database } from './database';
import { Pool } from 'pg';
import { CamelCasePlugin } from 'kysely';

interface DatabaseConnectionEnvironment {
  database: string;
  host: string;
  port: number;
  maxConnections?: number;
  user?: string;
  password?: string;
}

export const databaseConnectionFactory = (options: DatabaseConnectionEnvironment): Kysely<Database> => {
  const dialect = new PostgresDialect({
    pool: new Pool({
      database: options.database,
      host: options.host,
      port: options.port,
      max: options.maxConnections,
      user: options.user,
      password: options.password,
    }),
  });

  return new Kysely({ dialect, log: ['error'], plugins: [new CamelCasePlugin()] });
};
