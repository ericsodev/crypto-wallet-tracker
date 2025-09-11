import z from 'zod';
import { syncWalletQueue } from './queues';

const syncWalletJobSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('full'), walletId: z.uuid() }),
  z.object({ type: z.literal('range'), walletId: z.uuid(), startDate: z.coerce.date(), endDate: z.coerce.date() }),
]);

type SyncWalletJobRequest = z.infer<typeof syncWalletJobSchema>;

export function syncNewWallet(walletId: string) {
  syncWalletQueue.add('foobar', { type: 'full', walletId } satisfies SyncWalletJobRequest);
}
