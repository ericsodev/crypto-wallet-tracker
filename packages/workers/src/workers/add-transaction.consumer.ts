import type { Database } from '@common/database/database';
import { TransactionRepository } from '@common/database/repositories/transaction-repository';
import { WalletRepository, type WalletDTO } from '@common/database/repositories/wallet-repository';
import {
  addTransactionJobSchema,
  type TransactionPayload,
} from '@common/services/transaction-services/add-transaction-service.ts';
import { Worker, Job } from 'bullmq';
import type { Kysely } from 'kysely';
import { type WorkerEnvironment } from 'src/env';

export const addTransactionConsumerFactory = (db: Kysely<Database>, env: WorkerEnvironment) => {
  const walletRepo = new WalletRepository(db);
  const transactionRepo = new TransactionRepository(db);
  const addTransactionConsumer = new Worker(
    'addTransaction',
    async (job: Job) => {
      const request = addTransactionJobSchema.safeParse(job.data);

      if (!job.token) {
        await job.moveToFailed(new Error('No token'), job.token ?? '');
        return;
      }

      if (!request.success) {
        // Immediately fail without retry
        await job.moveToFailed(request.error, job.token);
        return;
      }
      const wallet = await walletRepo.get(request.data.walletId);
      if (!wallet) {
        // Immediately fail without retry
        await job.moveToFailed(new Error('Wallet does not exist'), job.token);
        return;
      }

      await processTransaction(transactionRepo, request.data.transaction, wallet);

      // Do something with job
      return 'some value';
    },
    { concurrency: 1, connection: { host: env.REDIS_HOST, port: env.REDIS_PORT }, autorun: false },
  );
  addTransactionConsumer.on('ready', () => {
    console.log('Add transaction consumer is ready');
  });

  addTransactionConsumer.on('closing', msg => {
    console.log('Add transaction consumer is closing:', msg);
  });

  addTransactionConsumer.on('error', error => {
    console.error('Add transaction consumer error:', error);
  });
  return addTransactionConsumer;
};

async function processTransaction(
  txService: TransactionRepository,
  transaction: TransactionPayload,
  wallet: WalletDTO,
) {
  const [existingTransaction] = await txService.getByFilter({ walletId: wallet.id, hash: transaction.hash });
  if (existingTransaction) return;

  await txService.createTransaction({
    walletId: wallet.id,
    userId: wallet.userId,
    hash: transaction.hash,
    type: 'WITHDRAWAL',
    amount: transaction.amount,
    fee: transaction.fee,
    blockNumber: transaction.blockNumber,
    recepientAddress: transaction.recipientAddress,
    senderAddress: transaction.senderAddress,
    timestamp: transaction.timestamp,
  });
}
