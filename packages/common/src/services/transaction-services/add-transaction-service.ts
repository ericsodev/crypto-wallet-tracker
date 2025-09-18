import { Job, JobsOptions } from 'bullmq';
import z from 'zod';
import { addTransactionQueue } from '../queues';
import { v4 } from 'uuid';

export const transactionDataSchema = z.object({
  blockNumber: z.coerce.number(),
  timestamp: z.coerce.date(),
  amount: z.string().min(1),
  fee: z.string().min(1),
  senderAddress: z.string().min(1),
  recipientAddress: z.string().min(1),
  type: z.enum(['WITHDRAWAL', 'DEPOSIT']),
  hash: z.string().min(1),
});

export const addTransactionJobSchema = z.object({
  walletId: z.uuid(),
  transaction: transactionDataSchema,
});

export type TransactionPayload = z.infer<typeof transactionDataSchema>;

export type TransactionEvent = z.infer<typeof addTransactionJobSchema>;

export const enqueueTransactionEvent = async (event: TransactionEvent, opts?: JobsOptions): Promise<Job> => {
  return addTransactionQueue.add(v4(), event, opts);
};

export const enqueueManyTransactionEvents = async (events: TransactionEvent[], opts?: JobsOptions): Promise<Job[]> => {
  return addTransactionQueue.addBulk(events.map(event => ({ name: v4(), data: event, opts })));
};
