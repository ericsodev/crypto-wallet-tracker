import { auth } from '@/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { db } from '@common/database/database-connection';
import { WalletDTO, WalletRepository } from '@common/database/repositories/wallet-repository';
import { Plus } from 'lucide-react';
import { unauthorized } from 'next/navigation';
import WalletCard from './wallet-card';
import { ConnectWallet } from './connect-wallet';

export interface WalletDetail extends WalletDTO {
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
        <ConnectWallet />
      </div>

      {/* Wallets Grid */}
      <div className="grid gap-6">
        {wallets.map(wallet => (
          <WalletCard key={wallet.id} wallet={wallet} />
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
