import { Queue } from 'bullmq';

export const syncWalletQueue = new Queue('walletSync');
