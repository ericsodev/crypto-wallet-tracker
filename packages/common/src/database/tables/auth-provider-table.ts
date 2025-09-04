import type { BaseTable } from './base-table';

export enum AuthProvider {
  GOOGLE = 'Google',
}

export interface AuthProviderTable extends BaseTable {
  userId: string;
  provider: AuthProvider;
  providerId: string;
}
