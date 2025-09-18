import { auth } from '@/auth';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { db } from '@common/database/database-connection';
import { TransactionRepository } from '@common/database/repositories/transaction-repository';
import { Download, ArrowLeftRight, ArrowUpRight, ArrowDownLeft, ExternalLink } from 'lucide-react';
import { unauthorized } from 'next/navigation';

interface TransactionDetail {
  id: string;
  type: 'WITHDRAWAL' | 'DEPOSIT';
  amount: string;
  fee: string;
  senderAddress: string;
  recipientAddress: string;
  timestamp: Date;
}

const Transactions = async () => {
  const transactionRepo = new TransactionRepository(db);
  const session = await auth();
  if (!session?.user?.id) {
    return unauthorized();
  }

  const transactions = await transactionRepo.listTransactions(session.user.id, {
    page: 1,
    pageSize: 20,
    sortDirection: 'desc',
  });
  //const transactions = [
  //  {
  //    id: '0x1a2b3c...',
  //    type: 'send',
  //    amount: 2.5,
  //    value: 5234.5,
  //    from: '0x742d35cc6cb32e532e86d0891c9e86d',
  //    to: '0x8f1a2bc3d4e5f6a7b8c9d0e1f2a3b4c5',
  //    timestamp: '2024-01-15T10:30:00Z',
  //    status: 'confirmed',
  //    gasUsed: 21000,
  //    gasPrice: 25.5,
  //  },
  //  {
  //    id: '0x2b3c4d...',
  //    type: 'receive',
  //    amount: 1.8,
  //    value: 3764.4,
  //    from: '0x9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b',
  //    to: '0x742d35cc6cb32e532e86d0891c9e86d',
  //    timestamp: '2024-01-14T15:45:00Z',
  //    status: 'confirmed',
  //    gasUsed: 21000,
  //    gasPrice: 22.8,
  //  },
  //  {
  //    id: '0x3c4d5e...',
  //    type: 'send',
  //    amount: 0.5,
  //    value: 1045.5,
  //    from: '0x742d35cc6cb32e532e86d0891c9e86d',
  //    to: '0x6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a',
  //    timestamp: '2024-01-13T09:15:00Z',
  //    status: 'confirmed',
  //    gasUsed: 21000,
  //    gasPrice: 18.2,
  //  },
  //  {
  //    id: '0x4d5e6f...',
  //    type: 'receive',
  //    amount: 3.2,
  //    value: 6691.2,
  //    from: '0x5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f',
  //    to: '0x742d35cc6cb32e532e86d0891c9e86d',
  //    timestamp: '2024-01-12T18:22:00Z',
  //    status: 'confirmed',
  //    gasUsed: 21000,
  //    gasPrice: 30.1,
  //  },
  //];

  const formatDate = (timestamp: Date) => {
    return timestamp.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

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
          <Button className="gradient-primary shadow-primary">
            <ArrowLeftRight className="mr-2 h-4 w-4" />
            New Transaction
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
          <div className="space-y-4">
            {transactions.map(tx => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-2 rounded-full ${
                      tx.type === 'receive' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'
                    }`}
                  >
                    {tx.type === 'receive' ? (
                      <ArrowDownLeft className="h-4 w-4" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-foreground capitalize">{tx.type}</h4>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success/20 text-success">
                        Complete
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="font-mono">From: {formatAddress(tx.senderAddress)}</span>
                      <span className="font-mono">To: {formatAddress(tx.recepientAddress)}</span>
                      <span>{formatDate(tx.timestamp)}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className={`font-bold text-lg ${tx.type === 'receive' ? 'text-success' : 'text-warning'}`}>
                    {tx.type === 'receive' ? '+' : '-'}
                    {tx.amount} ETH
                  </p>
                  <p className="text-sm text-muted-foreground">${tx.amount.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Gas: {tx.fee} ETH</p>
                </div>

                <div className="ml-4">
                  <a href={`https://etherscan.io/tx/${tx.hash}`} target="_blank">
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">Showing 1-4 of 1,247 transactions</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Transactions;
