import { environmentConfigSchema } from './env';
import { syncWalletConsumerFactory } from './workers/sync-wallet-consumer';
import { db } from '@common/database/database-connection';

const environment = environmentConfigSchema.parse(process.env);

const syncWalletConsumer = syncWalletConsumerFactory(db, environment);

syncWalletConsumer.run();
process.on('SIGTERM', () => {
  syncWalletConsumer.close();
});
process.on('SIGINT', () => {
  syncWalletConsumer.close();
});
