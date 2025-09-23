import { TransactionType } from '@common/database/tables/transaction-table';
import { TransactionDetail } from './page';
import { ArrowDownLeft, ArrowUpRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { auth } from '@/auth';
import { unauthorized } from 'next/navigation';
import { TransactionRepository } from '@common/database/repositories/transaction-repository';
import { db } from '@common/database/database-connection';

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

export async function TransactionCard({ tx }: { tx: TransactionDetail }) {
  return (
    <div key={tx.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border">
      <div className="flex items-center gap-4">
        <div
          className={`p-2 rounded-full ${tx.type === TransactionType.DEPOSIT ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'}`}
        >
          {tx.type === TransactionType.DEPOSIT ? (
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
            <span className="font-mono">To: {formatAddress(tx.recipientAddress)}</span>
            <span>{formatDate(tx.timestamp)}</span>
          </div>
        </div>
      </div>

      <div className="text-right">
        <p className={`font-bold text-lg ${tx.type === TransactionType.DEPOSIT ? 'text-success' : 'text-warning'}`}>
          {tx.type === TransactionType.DEPOSIT ? '+' : '-'}
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
  );
}
