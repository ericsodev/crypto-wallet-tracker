// Etherscan V2 API - Accounts Module Types and Methods

// Base types
export type ChainId = number;
export type Address = string;
export type BlockNumber = string | number;
export type BlockTag = 'earliest' | 'pending' | 'latest';
export type SortOrder = 'asc' | 'desc';
export type BlockType = 'blocks' | 'uncles';

// Base API response structure
export interface BaseResponse<T> {
  status: '0' | '1';
  message: string;
  result: T;
}

// Common query parameters
export interface BaseParams {
  chainid: ChainId;
}

export interface PaginationParams {
  page?: number;
  offset?: number;
}

// 1. Get Ether Balance for a Single Address
export interface BalanceParams extends BaseParams {
  module: 'account';
  action: 'balance';
  address: Address;
  tag: BlockTag;
}

export type BalanceResponse = BaseResponse<string>;

// 2. Get Ether Balance for Multiple Addresses
export interface BalanceMultiParams extends BaseParams {
  module: 'account';
  action: 'balancemulti';
  address: string; // comma-separated addresses (max 20)
  tag: BlockTag;
}

export interface BalanceMultiResult {
  account: Address;
  balance: string;
}

export type BalanceMultiResponse = BaseResponse<BalanceMultiResult[]>;

// 3. Get Normal Transactions by Address
export interface TxListParams extends BaseParams, PaginationParams {
  module: 'account';
  action: 'txlist';
  address: Address;
  startblock?: BlockNumber;
  endblock?: BlockNumber;
  sort?: SortOrder;
}

export interface Transaction {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  transactionIndex: string;
  from: Address;
  to: Address;
  value: string;
  gas: string;
  gasPrice: string;
  isError: '0' | '1';
  txreceipt_status: '0' | '1';
  input: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  gasUsed: string;
  confirmations: string;
  methodId?: string;
  functionName?: string;
}

export type TxListResponse = BaseResponse<Transaction[]>;

// 4. Get Internal Transactions by Address
export interface TxListInternalParams extends BaseParams, PaginationParams {
  module: 'account';
  action: 'txlistinternal';
  address: Address;
  startblock?: BlockNumber;
  endblock?: BlockNumber;
  sort?: SortOrder;
}

export interface InternalTransaction {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  from: Address;
  to: Address;
  value: string;
  contractAddress: string;
  input: string;
  type: string;
  gas: string;
  gasUsed: string;
  traceId: string;
  isError: '0' | '1';
  errCode: string;
}

export type TxListInternalResponse = BaseResponse<InternalTransaction[]>;

// 5. Get Internal Transactions by Hash
export interface TxListInternalByHashParams extends BaseParams {
  module: 'account';
  action: 'txlistinternal';
  txhash: string;
}

export type TxListInternalByHashResponse = BaseResponse<InternalTransaction[]>;

// 6. Get Internal Transactions by Block Range
export interface TxListInternalByBlockRangeParams extends BaseParams, PaginationParams {
  module: 'account';
  action: 'txlistinternal';
  startblock: BlockNumber;
  endblock: BlockNumber;
  sort?: SortOrder;
}

export type TxListInternalByBlockRangeResponse = BaseResponse<InternalTransaction[]>;

// 7. Get ERC20 Token Transfer Events
export interface TokenTxParams extends BaseParams, PaginationParams {
  module: 'account';
  action: 'tokentx';
  address?: Address;
  contractaddress?: Address;
  startblock?: BlockNumber;
  endblock?: BlockNumber;
  sort?: SortOrder;
}

export interface TokenTransfer {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  from: Address;
  contractAddress: Address;
  to: Address;
  value: string;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimal: string;
  transactionIndex: string;
  gas: string;
  gasPrice: string;
  gasUsed: string;
  cumulativeGasUsed: string;
  input: string;
  confirmations: string;
}

export type TokenTxResponse = BaseResponse<TokenTransfer[]>;

// 8. Get ERC721 Token Transfer Events
export interface TokenNftTxParams extends BaseParams, PaginationParams {
  module: 'account';
  action: 'tokennfttx';
  address?: Address;
  contractaddress?: Address;
  startblock?: BlockNumber;
  endblock?: BlockNumber;
  sort?: SortOrder;
}

export interface NftTransfer {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  from: Address;
  contractAddress: Address;
  to: Address;
  tokenID: string;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimal: string;
  transactionIndex: string;
  gas: string;
  gasPrice: string;
  gasUsed: string;
  cumulativeGasUsed: string;
  input: string;
  confirmations: string;
}

export type TokenNftTxResponse = BaseResponse<NftTransfer[]>;

// 9. Get ERC1155 Token Transfer Events
export interface Token1155TxParams extends BaseParams, PaginationParams {
  module: 'account';
  action: 'token1155tx';
  address?: Address;
  contractaddress?: Address;
  startblock?: BlockNumber;
  endblock?: BlockNumber;
  sort?: SortOrder;
}

export interface Erc1155Transfer {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  transactionIndex: string;
  gas: string;
  gasPrice: string;
  gasUsed: string;
  cumulativeGasUsed: string;
  input: string;
  contractAddress: Address;
  from: Address;
  to: Address;
  tokenID: string;
  tokenValue: string;
  tokenName: string;
  tokenSymbol: string;
  confirmations: string;
}

export type Token1155TxResponse = BaseResponse<Erc1155Transfer[]>;

// 10. Get Address Funded By
export interface FundedByParams extends BaseParams {
  module: 'account';
  action: 'fundedby';
  address: Address;
}

export interface FundedByResult {
  block: number;
  timeStamp: string;
  fundingAddress: Address;
  fundingTxn: string;
  value: string;
}

export type FundedByResponse = BaseResponse<FundedByResult>;

// 11. Get Blocks Validated by Address
export interface MinedBlocksParams extends BaseParams, PaginationParams {
  module: 'account';
  action: 'getminedblocks';
  address: Address;
  blocktype: BlockType;
}

export interface MinedBlock {
  blockNumber: string;
  timeStamp: string;
  blockReward: string;
}

export type MinedBlocksResponse = BaseResponse<MinedBlock[]>;

// 12. Get Beacon Chain Withdrawals
export interface BeaconWithdrawalsParams extends BaseParams, PaginationParams {
  module: 'account';
  action: 'txsBeaconWithdrawal';
  address: Address;
  startblock?: BlockNumber;
  endblock?: BlockNumber;
  sort?: SortOrder;
}

export interface BeaconWithdrawal {
  withdrawalIndex: string;
  validatorIndex: string;
  address: Address;
  amount: string;
  blockNumber: string;
  timestamp: string;
}

export type BeaconWithdrawalsResponse = BaseResponse<BeaconWithdrawal[]>;

// 13. Get Historical Balance (PRO endpoint - included for completeness)
export interface BalanceHistoryParams extends BaseParams {
  module: 'account';
  action: 'balancehistory';
  address: Address;
  blockno: BlockNumber;
}

export type BalanceHistoryResponse = BaseResponse<string>;

// API Client class
export class EtherscanAccountsAPI {
  private baseUrl: string;
  private defaultChainId: ChainId;
  private apiKey: string;

  constructor(apiKey: string, chainId: ChainId = 1) {
    this.baseUrl = 'https://api.etherscan.io/v2/api';
    this.defaultChainId = chainId;
    this.apiKey = apiKey;
  }

  private async request<T>(params: Record<string, any>): Promise<T> {
    const url = new URL(this.baseUrl);

    // Add default chainid if not provided
    if (!params.chainid) {
      params.chainid = this.defaultChainId;
    }

    // Add API key if not provided
    if (!params.apikey) {
      params.apikey = this.apiKey;
    }

    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, String(params[key]));
      }
    });

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json() as T;
  }

  // 1. Get single address balance
  async getBalance(params: Omit<BalanceParams, 'module' | 'action'>): Promise<BalanceResponse> {
    return this.request<BalanceResponse>({
      module: 'account',
      action: 'balance',
      ...params,
    });
  }

  // 2. Get multiple addresses balance
  async getBalanceMulti(params: Omit<BalanceMultiParams, 'module' | 'action'>): Promise<BalanceMultiResponse> {
    return this.request<BalanceMultiResponse>({
      module: 'account',
      action: 'balancemulti',
      ...params,
    });
  }

  // 3. Get normal transactions by address
  async getNormalTransactions(params: Omit<TxListParams, 'module' | 'action'>): Promise<TxListResponse> {
    return this.request<TxListResponse>({
      module: 'account',
      action: 'txlist',
      ...params,
    });
  }

  // 4. Get internal transactions by address
  async getInternalTransactions(
    params: Omit<TxListInternalParams, 'module' | 'action'>,
  ): Promise<TxListInternalResponse> {
    return this.request<TxListInternalResponse>({
      module: 'account',
      action: 'txlistinternal',
      ...params,
    });
  }

  // 5. Get internal transactions by hash
  async getInternalTransactionsByHash(
    params: Omit<TxListInternalByHashParams, 'module' | 'action'>,
  ): Promise<TxListInternalByHashResponse> {
    return this.request<TxListInternalByHashResponse>({
      module: 'account',
      action: 'txlistinternal',
      ...params,
    });
  }

  // 6. Get internal transactions by block range
  async getInternalTransactionsByBlockRange(
    params: Omit<TxListInternalByBlockRangeParams, 'module' | 'action'>,
  ): Promise<TxListInternalByBlockRangeResponse> {
    return this.request<TxListInternalByBlockRangeResponse>({
      module: 'account',
      action: 'txlistinternal',
      ...params,
    });
  }

  // 7. Get ERC20 token transfers
  async getERC20Transfers(params: Omit<TokenTxParams, 'module' | 'action'>): Promise<TokenTxResponse> {
    return this.request<TokenTxResponse>({
      module: 'account',
      action: 'tokentx',
      ...params,
    });
  }

  // 8. Get ERC721 token transfers
  async getERC721Transfers(params: Omit<TokenNftTxParams, 'module' | 'action'>): Promise<TokenNftTxResponse> {
    return this.request<TokenNftTxResponse>({
      module: 'account',
      action: 'tokennfttx',
      ...params,
    });
  }

  // 9. Get ERC1155 token transfers
  async getERC1155Transfers(params: Omit<Token1155TxParams, 'module' | 'action'>): Promise<Token1155TxResponse> {
    return this.request<Token1155TxResponse>({
      module: 'account',
      action: 'token1155tx',
      ...params,
    });
  }

  // 10. Get address funded by
  async getFundedBy(params: Omit<FundedByParams, 'module' | 'action'>): Promise<FundedByResponse> {
    return this.request<FundedByResponse>({
      module: 'account',
      action: 'fundedby',
      ...params,
    });
  }

  // 11. Get blocks mined by address
  async getMinedBlocks(params: Omit<MinedBlocksParams, 'module' | 'action'>): Promise<MinedBlocksResponse> {
    return this.request<MinedBlocksResponse>({
      module: 'account',
      action: 'getminedblocks',
      ...params,
    });
  }

  // 12. Get beacon chain withdrawals
  async getBeaconWithdrawals(
    params: Omit<BeaconWithdrawalsParams, 'module' | 'action'>,
  ): Promise<BeaconWithdrawalsResponse> {
    return this.request<BeaconWithdrawalsResponse>({
      module: 'account',
      action: 'txsBeaconWithdrawal',
      ...params,
    });
  }

  // 13. Get historical balance (PRO endpoint)
  async getBalanceHistory(params: Omit<BalanceHistoryParams, 'module' | 'action'>): Promise<BalanceHistoryResponse> {
    return this.request<BalanceHistoryResponse>({
      module: 'account',
      action: 'balancehistory',
      ...params,
    });
  }
}

// Usage example:
/*
const api = new EtherscanAccountsAPI('YOUR_API_KEY', 1); // chainId 1 for Ethereum mainnet

// Get balance for a single address
const balance = await api.getBalance({
  address: '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae',
  tag: 'latest'
});

// Get normal transactions
const transactions = await api.getNormalTransactions({
  address: '0xc5102fE9359FD9a28f877a67E36B0F050d81a3CC',
  startblock: 0,
  endblock: 99999999,
  page: 1,
  offset: 10,
  sort: 'asc'
});

// Get ERC20 token transfers
const tokenTransfers = await api.getERC20Transfers({
  address: '0x4e83362442b8d1bec281594cea3050c8eb01311c',
  contractaddress: '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2',
  page: 1,
  offset: 100,
  sort: 'asc'
});
*/
