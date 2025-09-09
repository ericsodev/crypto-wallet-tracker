import type { AuthProviderTable } from './tables/auth-provider-table';
import type { UserTable } from './tables/user-table';
import type { WalletTable } from './tables/wallet-table';

export interface Database {
  authProvider: AuthProviderTable;
  user: UserTable;
  wallet: WalletTable;
}
