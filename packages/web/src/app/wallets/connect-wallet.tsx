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
import { Plus } from 'lucide-react';
import { useAppKitWallet } from '@reown/appkit-wallet-button/react';

export function ConnectWallet() {
  const { connect } = useAppKitWallet({
    namespace: 'eip155',
    onSuccess: foo => {
      console.log(foo);
    },
  });
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button className="gradient-primary shadow-primary">
            <Plus className="mr-2 h-4 w-4" />
            Connect Wallet
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Connect Wallet</DialogTitle>
            <DialogDescription>
              Choose a wallet to connect to your account or manually input an Ethereum address.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                connect('metamask');
              }}
            >
              MetaMask
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                connect('coinbase');
              }}
            >
              Coinbase
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                connect('kraken');
              }}
            >
              Kraken
            </Button>
          </div>
          <Separator className="mt-4 mb-4" />
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Wallet Name</Label>
              <Input id="name-1" name="name" defaultValue="" placeholder="Name" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="username-1">Address</Label>
              <Input id="username-1" name="username" defaultValue="" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
