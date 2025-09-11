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
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { deleteWallet } from '../actions/delete-wallet';
import { WalletDetail } from './page';
import { toast } from 'sonner';

export function ConfirmDeleteWallet({ wallet, trigger }: { wallet: WalletDetail; trigger?: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10">
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Wallet</DialogTitle>
          <DialogDescription>Confirm you want to delete '{wallet.name}' permanently.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:bg-destructive/10"
            onClick={async () => {
              await deleteWallet(wallet.id);
              toast(`The wallet '${wallet.name}' has been deleted`, { description: 'foobar' });
              setIsOpen(false);
            }}
          >
            Delete
            <Trash2 className="h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
