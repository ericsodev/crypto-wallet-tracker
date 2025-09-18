import { environmentConfigSchema } from './env';
import { EtherscanAccountsAPI } from './sdk/etherscan/accounts';
import { addTransactionConsumerFactory } from './workers/add-transaction.consumer';
import { syncWalletConsumerFactory } from './workers/sync-wallet-consumer';
import { db } from '@common/database/database-connection';

const environment = environmentConfigSchema.parse(process.env);
const etherscanSdk = new EtherscanAccountsAPI(environment.ETHERSCAN_API_KEY);

const syncWalletConsumer = syncWalletConsumerFactory(db, environment, etherscanSdk);
const addTransactionConsumer = addTransactionConsumerFactory(db, environment);

syncWalletConsumer.run();
addTransactionConsumer.run();
process.on('SIGTERM', async () => {
  await syncWalletConsumer.close();
  await addTransactionConsumer.close();
  process.exit(0);
});
process.on('SIGINT', async () => {
  await syncWalletConsumer.close();
  await addTransactionConsumer.close();
  process.exit(0);
});
