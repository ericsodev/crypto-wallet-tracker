import { z } from 'zod';
export const connectWalletFormSchema = z.object({
  walletName: z.string().min(1).max(64),
  walletAddress: z.string().min(1).max(255),
});
