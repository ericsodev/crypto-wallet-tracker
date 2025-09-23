import { auth } from '@/auth';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TransactionType } from '@common/database/tables/transaction-table';
import { Download, ArrowLeftRight, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { unauthorized, useSearchParams } from 'next/navigation';
import { TransactionTable } from './transaction-table';
import { PaginationControls } from './pagination-controls';
import { flattenSearchParam } from '@/lib/flatten-search-param';

export interface TransactionDetail {
  id: string;
  type: TransactionType;
  amount: string;
  fee: string;
  senderAddress: string;
  recipientAddress: string;
  timestamp: Date;
  hash: string;
}

const Transactions = async (props: PageProps<'/transactions'>) => {
  const session = await auth();
  if (!session?.user?.id) {
    return unauthorized();
  }

  const searchParams = await props.searchParams;
  const page = Number(searchParams['page']) || 1;

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Transaction History</h1>
          <p className="text-muted-foreground">View all your wallet transactions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-card border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Sent</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">15.7 ETH</div>
            <p className="text-xs text-muted-foreground">$32,845.60</p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Received</CardTitle>
            <ArrowDownLeft className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">23.4 ETH</div>
            <p className="text-xs text-muted-foreground">$48,972.80</p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Gas Fees Paid</CardTitle>
            <ArrowLeftRight className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">0.52 ETH</div>
            <p className="text-xs text-muted-foreground">$1,087.20</p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Net Change</CardTitle>
            <ArrowLeftRight className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">+7.18 ETH</div>
            <p className="text-xs text-muted-foreground">+$15,039.40</p>
          </CardContent>
        </Card>
      </div>

      {/* Transaction List */}
      <Card className="shadow-card border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">All Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionTable page={page} hash={flattenSearchParam(searchParams['hash'])} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Transactions;
