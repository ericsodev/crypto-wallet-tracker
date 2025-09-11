'use server';

import { auth } from '@/auth';
import { db } from '@common/database/database-connection';
import { WalletRepository } from '@common/database/repositories/wallet-repository';
import { unauthorized } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export const deleteWallet = async (id: string) => {
  const session = await auth();
  if (!session?.user?.id) return unauthorized();
  const walletRepo = new WalletRepository(db);
  const wallet = await walletRepo.get(id);

  if (!wallet) throw new Error('Wallet not found');
  if (wallet.userId !== session.user.id) return unauthorized();

  await walletRepo.delete(id);

  revalidatePath('/wallets');
  return { success: true, walletId: wallet.id };
};
