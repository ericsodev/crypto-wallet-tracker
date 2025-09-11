import type { BaseTable } from './base-table';

export interface WalletBalanceTable extends BaseTable {
  walletId: string;
  balance: string;
  timestamp: Date;
}
