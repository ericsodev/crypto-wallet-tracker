import type { BaseTable } from './base-table';

export interface WalletTable extends BaseTable {
  name: string;
  address: string;
  parentId: string | null;
  userId: string;
}
