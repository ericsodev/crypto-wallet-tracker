import type { Database } from '@common/database/database';
import { Worker, Job } from 'bullmq';
import { sleep } from 'bun';
import type { Kysely } from 'kysely';
import { environmentConfigSchema, type WorkerEnvironment } from 'src/env';

export const syncWalletConsumerFactory = (db: Kysely<Database>, env: WorkerEnvironment) => {
  const syncWalletConsumer = new Worker(
    'walletSync',
    async (job: Job) => {
      // Optionally report some progress
      await job.updateProgress(42);
      console.log('job data', job.id, job.data);
      await sleep(10000);

      // Do something with job
      return 'some value';
    },
    { concurrency: 4, connection: { host: env.REDIS_HOST, port: env.REDIS_PORT }, autorun: false },
  );
  syncWalletConsumer.on('ready', () => {
    console.log('Sync wallet consumer is ready');
  });

  syncWalletConsumer.on('closing', msg => {
    console.log('Sync wallet consumer is closing:', msg);
  });

  syncWalletConsumer.on('error', error => {
    console.error('Sync wallet consumer error:', error);
  });
  return syncWalletConsumer;
};
