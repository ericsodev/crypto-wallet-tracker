import type { BaseTable } from './base-table';

export interface AuthProviderTable extends BaseTable {
  userId: string;
  provider: string;
  providerId: string;
}
