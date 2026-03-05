import z from 'zod';

export const etherscanInternalTransactionSchema = z.object({
  blockNumber: z.string(),
  timeStamp: z.string(),
  hash: z.string(),
  nonce: z.string(),
  blockHash: z.string(),
  transactionIndex: z.string(),
  from: z.string(),
  to: z.string(),
  value: z.string(),
  gas: z.string(),
  gasPrice: z.string(),
  isError: z.enum(['0', '1']),
  txreceipt_status: z.enum(['0', '1']),
  input: z.string(),
  contractAddress: z.string(),
  cumulativeGasUsed: z.string(),
  gasUsed: z.string(),
  confirmations: z.string(),
  methodId: z.string().optional(),
  functionName: z.string().optional(),
});

export type EtherscanInternalTransaction = z.infer<typeof etherscanInternalTransactionSchema>;
