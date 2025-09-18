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
process.on('SIGTERM', () => {
  syncWalletConsumer.close();
  addTransactionConsumer.close();
});
process.on('SIGINT', () => {
  syncWalletConsumer.close();
  addTransactionConsumer.close();
});
