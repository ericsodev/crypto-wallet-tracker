import { Worker, Job } from 'bullmq';

const worker = new Worker(
  'walletSync',
  async (job: Job) => {
    // Optionally report some progress
    await job.updateProgress(42);

    // Optionally sending an object as progress
    await job.updateProgress({ foo: 'bar' });

    // Do something with job
    return 'some value';
  },
  { concurrency: 4, connection: { host: 'localhost', port: 6379 } },
);
