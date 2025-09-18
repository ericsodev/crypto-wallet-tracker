import type { TransactionPayload } from '@common/services/transaction-services/add-transaction-service';
import bigDecimal from 'js-big-decimal';
import type { EtherscanInternalTransaction } from 'src/sdk/etherscan/schema';

export const mapEtherscanInternalTransaction = (transaction: EtherscanInternalTransaction): TransactionPayload => {
  return {
    amount: new bigDecimal(transaction.value).divide(new bigDecimal('1e18')).getValue(),
    fee: new bigDecimal(transaction.gasPrice)
      .multiply(new bigDecimal(transaction.gasUsed))
      .divide(new bigDecimal('1e18'))
      .getValue(),
    blockNumber: Number(transaction.blockNumber),
    hash: transaction.hash,
    senderAddress: transaction.from,
    recipientAddress: transaction.to,
    timestamp: new Date(transaction.timeStamp), // from unix epoch,
    type: 'WITHDRAWAL',
  };
};
