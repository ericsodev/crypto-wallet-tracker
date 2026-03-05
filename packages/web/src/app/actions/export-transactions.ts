'use server';

import { auth } from '@/auth';
import { db } from '@common/database/database-connection';
import { TransactionRepository, TransactionDTO } from '@common/database/repositories/transaction-repository';
import { TransactionType } from '@common/database/tables/transaction-table';
import { unauthorized } from 'next/navigation';

export async function exportTransactions(params: {
  walletId?: string;
  startDate?: string;
  endDate?: string;
  type?: TransactionType;
}): Promise<TransactionDTO[]> {
  const session = await auth();
  if (!session?.user?.id) return unauthorized();

  const transactionRepo = new TransactionRepository(db);

  const filters: Partial<TransactionDTO> = {};
  if (params.walletId) filters.walletId = params.walletId;
  if (params.type) filters.type = params.type;

  return transactionRepo.getAllTransactions(session.user.id, filters, {
    startDate: params.startDate ? new Date(params.startDate) : undefined,
    endDate: params.endDate ? new Date(params.endDate) : undefined,
  });
}
