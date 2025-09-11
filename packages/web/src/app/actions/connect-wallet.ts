'use server';

import { z } from 'zod';
import { auth } from '@/auth';
import { db } from '@common/database/database-connection';
import { WalletRepository } from '@common/database/repositories/wallet-repository';
import { unauthorized } from 'next/navigation';
import { connectWalletFormSchema } from '../schemas/connect-wallet';
import { revalidatePath } from 'next/cache';

export const createWallet = async (_initialState: any, formData: FormData) => {
  const session = await auth();
  if (!session?.user?.id) return unauthorized();
  const validatedData = connectWalletFormSchema.safeParse({
    walletName: formData.get('walletName'),
    walletAddress: formData.get('walletAddress'),
  });
  if (validatedData.error) {
    return {
      success: false,
      errors: z.treeifyError(validatedData.error),
    };
  }
  const walletRepo = new WalletRepository(db);
  const wallet = await walletRepo.createWallet(
    session.user.id,
    validatedData.data.walletName,
    validatedData.data.walletAddress,
  );

  revalidatePath('/wallets');
  return { success: true, walletId: wallet.id };
};
