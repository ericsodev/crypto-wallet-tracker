import { auth, signOut } from '@/auth';
import CopyButton from '@/components/copy-button/copy-button';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { db } from '@common/database/database-connection';
import { WalletDTO, WalletRepository } from '@common/database/repositories/wallet-repository';
import { ExternalLink, Plus, Trash2 } from 'lucide-react';
import { unauthorized } from 'next/navigation';

interface WalletDetail extends WalletDTO {
  balance: string;
  lastActivity: string;
  fiatValue?: {
    currency: string;
    value: string;
  };
  transactions: number;
}

export default async function Wallets() {
  const session = await auth();
  if (!session?.user?.id) {
    return unauthorized();
  }

  const walletRepo = new WalletRepository(db);
  const wallets: WalletDetail[] = (await walletRepo.getByUserId(session.user.id)).map(wallet => ({
    ...wallet,
    balance: '0',
    lastActivity: 'No activity',
    transactions: 0,
  }));

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Wallets</h1>
          <p className="text-muted-foreground">Manage your connected wallets</p>
        </div>
        <Button className="gradient-primary shadow-primary">
          <Plus className="mr-2 h-4 w-4" />
          Connect Wallet
        </Button>
      </div>

      {/* Wallets Grid */}
      <div className="grid gap-6">
        {wallets.map(wallet => (
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
        ))}
      </div>

      {/* Empty State */}
      {wallets.length === 0 && (
        <Card className="shadow-card border-border bg-card">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No wallets connected</h3>
            <p className="text-muted-foreground text-center mb-4">
              Connect your first wallet to start tracking your portfolio
            </p>
            <Button className="gradient-primary shadow-primary">
              <Plus className="mr-2 h-4 w-4" />
              Connect Your First Wallet
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
