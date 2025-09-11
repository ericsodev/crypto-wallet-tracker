import type { Database } from '@common/database/database';
import { WalletBalanceRepository } from '@common/database/repositories/wallet-balance-repository';
import { WalletRepository } from '@common/database/repositories/wallet-repository';
import { syncWalletJobSchema } from '@common/services/wallet-sync-service';
import { Worker, Job } from 'bullmq';
import { sleep } from 'bun';
import bigDecimal from 'js-big-decimal';
import type { Kysely } from 'kysely';
import { type WorkerEnvironment } from 'src/env';
import type { EtherscanAccountsAPI } from 'src/sdk/etherscan/accounts';

export const syncWalletConsumerFactory = (db: Kysely<Database>, env: WorkerEnvironment, sdk: EtherscanAccountsAPI) => {
  const walletRepo = new WalletRepository(db);
  const walletBalanceRepo = new WalletBalanceRepository(db);
  const syncWalletConsumer = new Worker(
    'walletSync',
    async (job: Job) => {
      // Optionally report some progress
      await job.updateProgress(42);
      console.log('job data', job.id, job.data);
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

      const balance = await sdk.getBalance({ address: wallet.address, tag: 'latest', chainid: 1 });
      const weiBalance = balance.result; // TODO: result in wei
      const ethBalance = new bigDecimal(weiBalance).divide(new bigDecimal('1e18')).getValue();

      let hasNextBlock = true;
      let nextBlock: number = 0;
      //while (hasNextBlock) {
      //  const transactions = await sdk.getNormalTransactions({
      //    address: wallet.address,
      //    chainid: 1,
      //    startblock: nextBlock,
      //    endblock: 'latest',
      //    page: 1,
      //    offset: 1000,
      //    sort: 'asc',
      //  });
      //
      //  let hasNextBlock = transactions.result.length < 1000;
      //  nextBlock = Number(transactions.result.at(transactions.result.length - 1)?.blockNumber) + 1;
      //
      //  await sleep(1000); // TODO: explore tracking rate limits
      //}

      await walletBalanceRepo.storeWalletBalance(wallet.id, ethBalance, new Date());
      console.log('Stored wallet balance');

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
