import { CamelCasePlugin } from 'kysely';
import { defineConfig } from 'kysely-ctl';
import { databaseConnectionFromEnv } from '../packages/common/src/database/database-connection';
import z from 'zod';

export default defineConfig({
  // replace me with a real dialect instance OR a dialect name + `dialectConfig` prop.
  kysely: () => {
    const env = z.enum(['production', 'development']).parse(process.env['NODE_ENV']);
    return databaseConnectionFromEnv(env);
  },
  migrations: {
    migrationFolder: '../database/migrations',
  },
  plugins: [new CamelCasePlugin()],
  seeds: {
    seedFolder: '../database/seeds',
  },
});
