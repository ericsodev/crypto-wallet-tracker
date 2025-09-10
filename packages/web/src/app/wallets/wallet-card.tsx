import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WalletDetail } from './page';
import CopyButton from '@/components/copy-button/copy-button';
import { Button } from '@/components/ui/button';
import { ExternalLink, Trash2 } from 'lucide-react';

export default function WalletCard({ wallet }: { wallet: WalletDetail }) {
  return (
    <Card key={wallet.id} className="shadow-card border-border bg-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-foreground">{wallet.name}</CardTitle>
          <div className="flex items-center gap-2">
            <CopyButton value={wallet.address} />
            <a href={`https://etherscan.io/address/${wallet.address}`} target="_blank">
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </a>
            <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-sm text-muted-foreground">Address</p>
            <p className="font-mono text-sm text-foreground">{wallet.address.slice(0, 20)}...</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Balance</p>
            <p className="font-bold text-lg text-foreground">{wallet.balance} ETH</p>
          </div>
          <div>
            {wallet.fiatValue ? (
              <>
                <p className="text-sm text-muted-foreground">{wallet.fiatValue.currency} Value</p>
                <p className="font-bold text-lg text-foreground">${wallet.fiatValue.value.toLocaleString()}</p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No Exchange Rate</p>
            )}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Transactions</p>
            <p className="font-medium text-foreground">{wallet.transactions}</p>
            <p className="text-xs text-muted-foreground">Last: {wallet.lastActivity}</p>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <Button variant="outline" size="sm">
            View Transactions
          </Button>
          <Button variant="outline" size="sm">
            Export Data
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
