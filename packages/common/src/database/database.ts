import type { AuthProviderTable } from './tables/auth-provider-table';
import type { UserTable } from './tables/user-table';

export interface Database {
  user: UserTable;
  authProvider: AuthProviderTable;
}
