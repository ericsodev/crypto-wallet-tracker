import { Kysely, PostgresDialect } from 'kysely';
import type { Database } from './database';
import { Pool } from 'pg';
import { CamelCasePlugin } from 'kysely';
import z from 'zod';

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

const productionEnvSchema = z.object({
  DB_HOST: z.string().min(1),
  DB_PORT: z.number(),
  DB_USER: z.string().min(1).optional(),
  DB_PASSWORD: z.string().min(1).optional(),
  DB_NAME: z.string().min(1),
});

export const databaseConnectionFromEnv = (environment: 'development' | 'production'): Kysely<Database> => {
  if (environment === 'development') {
    return databaseConnectionFactory({ database: 'crypto', host: 'localhost', port: 5432, maxConnections: 10 });
  }

  const { DB_HOST, DB_NAME, DB_PORT, DB_PASSWORD, DB_USER } = productionEnvSchema.parse(process.env);
  return databaseConnectionFactory({
    database: DB_NAME,
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    maxConnections: 50,
  });
};
