'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Loader2Icon, Plus } from 'lucide-react';
import { createWallet } from '../actions/connect-wallet';
import { useActionState, useEffect, useState } from 'react';

export function ConnectWallet() {
  const [state, formAction, pending] = useActionState(createWallet, { success: false, errors: { errors: [] } });
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    if (state.success) {
      setIsOpen(false);
      window.history.pushState(null, '', `/wallets#${state.walletId}`);
    }
  }, [state]);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gradient-primary shadow-primary">
          <Plus className="mr-2 h-4 w-4" />
          Connect Wallet
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form action={formAction}>
          <DialogHeader>
            <DialogTitle>Connect Wallet</DialogTitle>
            <DialogDescription>
              Choose a wallet to connect to your account or manually input an Ethereum address.
            </DialogDescription>
          </DialogHeader>
          <Separator className="mt-4 mb-4" />
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="walletName">Wallet Name</Label>
              <Input id="walletName" name="walletName" placeholder="Name" maxLength={255} required />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="walletAddress">Address</Label>
              <Input id="walletAddress" name="walletAddress" required />
            </div>
          </div>
          <Separator className="mt-4 mb-4" />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={pending}>
              {pending && <Loader2Icon className="animate-spin" />}
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
