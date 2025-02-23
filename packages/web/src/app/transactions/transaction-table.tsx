import { TransactionRepository } from '@common/database/repositories/transaction-repository';
import { TransactionCard } from './transaction-card';
import { db } from '@common/database/database-connection';
import { auth } from '@/auth';
import { unauthorized } from 'next/navigation';
import { PaginationControls } from './pagination-controls';
import { TransactionFilters } from './transaction-filters';

export async function TransactionTable({
  page,
  startDate,
  endDate,
  ...filters
}: TransactionFilters & { page: number }) {
  const session = await auth();
  if (!session?.user?.id) {
    return unauthorized();
  }

  const transactionRepo = new TransactionRepository(db);
  const { data: transactions, pagination } = await transactionRepo.listTransactions(
    session.user.id,
    {
      page,
      pageSize: 20,
      sortDirection: 'desc',
    },
    filters,
    { startDate: startDate ? new Date(startDate) : undefined, endDate: endDate ? new Date(endDate) : undefined },
  );

  return (
    <>
      <div className="space-y-4">
        <TransactionFilters />
        {transactions.map(tx => (
          <TransactionCard key={tx.id} tx={tx} />
        ))}
      </div>
      <PaginationControls pagination={pagination} />
    </>
  );
}
