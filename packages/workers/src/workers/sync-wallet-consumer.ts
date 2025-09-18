import type { Database } from '@common/database/database';
import { WalletBalanceRepository } from '@common/database/repositories/wallet-balance-repository';
import { WalletRepository, type WalletDTO } from '@common/database/repositories/wallet-repository';
import { addTransactionQueue } from '@common/services/queues';
import { enqueueManyTransactionEvents } from '@common/services/transaction-services/add-transaction-service';
import { syncWalletJobSchema } from '@common/services/wallet-sync-service';
import { Worker, Job } from 'bullmq';
import { sleep } from 'bun';
import bigDecimal from 'js-big-decimal';
import type { Kysely } from 'kysely';
import { type WorkerEnvironment } from 'src/env';
import type { EtherscanAccountsAPI, Transaction, TxListResponse } from 'src/sdk/etherscan/accounts';
import { mapEtherscanInternalTransaction } from 'src/services/tranasction-service/map-external-transactions';
import { v4 } from 'uuid';

export const syncWalletConsumerFactory = (db: Kysely<Database>, env: WorkerEnvironment, sdk: EtherscanAccountsAPI) => {
  const walletRepo = new WalletRepository(db);
  const walletBalanceRepo = new WalletBalanceRepository(db);
  const syncWalletConsumer = new Worker(
    'walletSync',
    async (job: Job, token) => {
      const request = syncWalletJobSchema.safeParse(job.data);

      if (!request.success) {
        // Immediately fail without retry
        await job.moveToFailed(request.error, job.token ?? '');
        return;
      }
      const wallet = await walletRepo.get(request.data.walletId);
      if (!wallet) {
        // Immediately fail without retry
        await job.moveToFailed(new Error('Wallet does not exist'), job.token ?? '');
        return;
      }

      if (!token) {
        await job.moveToFailed(new Error('No token'), job.token ?? '');
        return;
      }

      await sleep(10);

      const balance = await sdk.getBalance({ address: wallet.address, tag: 'latest', chainid: 1 });
      const weiBalance = balance.result; // TODO: result in wei
      const ethBalance = new bigDecimal(weiBalance).divide(new bigDecimal('1e18')).getValue();
      await walletBalanceRepo.storeWalletBalance(wallet.id, ethBalance, new Date());

      // TODO: range filters
      const transactions = await getAllTransactions(sdk, wallet);
      await enqueueManyTransactionEvents(
        transactions.map(transaction => ({
          walletId: wallet.id,
          transaction: mapEtherscanInternalTransaction(transaction),
        })),
      );
      await addTransactionQueue.addBulk(
        transactions.map(transaction => ({
          data: { walletId: wallet.id, transaction },
          name: v4(),
          opts: { parent: { id: job.id ?? '', queue: job.queueQualifiedName }, attempts: 1 },
        })),
      );
      await job.moveToWaitingChildren(token);

      // Do something with job
      return 'some value';
    },
    { concurrency: 1, connection: { host: env.REDIS_HOST, port: env.REDIS_PORT }, autorun: false },
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

async function getAllTransactions(sdk: EtherscanAccountsAPI, wallet: WalletDTO) {
  let hasNextBlock = true;
  let nextBlock: number = 0;
  const allTransactions: Transaction[] = [];
  while (hasNextBlock) {
    const transactions = await sdk.getNormalTransactions({
      address: wallet.address,
      chainid: 1,
      startblock: nextBlock,
      endblock: 'latest',
      page: 1,
      offset: 1000,
      sort: 'asc',
    });
    allTransactions.push(...transactions.result);

    hasNextBlock = transactions.result.length >= 1000;
    const currentBlock = Number(transactions.result.at(transactions.result.length - 1)?.blockNumber);
    if (Number.isNaN(currentBlock)) {
      break;
    }
    nextBlock = currentBlock + 1;

    await sleep(1000);
  }
  return allTransactions;
}
