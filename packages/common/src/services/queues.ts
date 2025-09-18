import { Queue } from 'bullmq';

export const syncWalletQueue = new Queue('walletSync', {
  defaultJobOptions: { removeOnComplete: 250, removeOnFail: 500 },
  connection: { host: 'localhost', port: 6379 },
});
export const addTransactionQueue = new Queue('addTransaction', {
  defaultJobOptions: { removeOnComplete: 250, removeOnFail: 500 },
  connection: { host: 'localhost', port: 6379 },
});
