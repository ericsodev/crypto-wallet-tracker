import type { BaseTable } from './base-table';

export enum TransactionType {
  DEPOSIT = 'Deposit',
  WITHDRAWAL = 'Withdrawal',
  CONTRACT = 'Contract',
}

export interface TransactionTable extends BaseTable {
  userId: string;
  walletId: string;
  type: string;
  timestamp: Date;
  blockNumber: number;
  amount: string;
  fee: string;
  senderAddress: string;
  recepientAddress: string;
  hash: string;
}
