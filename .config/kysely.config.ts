import { CamelCasePlugin } from 'kysely';
import { defineConfig, DUMMY_DIALECT_CONFIG, KyselyCTLConfig } from 'kysely-ctl';
import { Pool } from 'pg';
import { z } from 'zod';

const productionEnvSchema = z.object({
  DB_HOST: z.string().min(1),
  DB_PORT: z.number(),
  DB_USER: z.string().min(1).optional(),
  DB_PASSWORD: z.string().min(1).optional(),
  DB_NAME: z.string().min(1),
});

export default defineConfig({
  // replace me with a real dialect instance OR a dialect name + `dialectConfig` prop.
  $env: {
    development: {
      dialect: 'pg',
      dialectConfig: {
        pool: new Pool({
          host: 'localhost',
          database: 'postgres',
          port: 5432,
          max: 10,
        }),
      },
    } satisfies KyselyCTLConfig,
    production: {
      dialect: 'pg',
      plugins: [new CamelCasePlugin()],
      dialectConfig: () => {
        const { DB_HOST, DB_NAME, DB_PORT, DB_PASSWORD, DB_USER } = productionEnvSchema.parse(process.env);
        return {
          pool: new Pool({
            host: DB_HOST,
            port: DB_PORT,
            user: DB_USER,
            password: DB_PASSWORD,
            database: DB_NAME,
            max: 50,
          }),
        };
      },
    } satisfies KyselyCTLConfig,
  },
  migrations: {
    migrationFolder: '../database/migrations',
  },
  plugins: [new CamelCasePlugin()],
  seeds: {
    seedFolder: '../database/seeds',
  },
});
