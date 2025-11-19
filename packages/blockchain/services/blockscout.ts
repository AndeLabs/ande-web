/**
 * Blockscout API Service
 *
 * Provides typed access to Blockscout REST API for ANDE Network
 * Base URL: https://explorer.ande.network/api/v2
 */

// Use public URL for client-side, internal for server-side
const BLOCKSCOUT_API_URL = process.env.NEXT_PUBLIC_BLOCKSCOUT_API_URL || 'https://explorer.ande.network/api/v2';

// Types for Blockscout API responses
export interface BlockscoutStats {
  average_block_time: number;
  coin_image: string | null;
  coin_price: string | null;
  coin_price_change_percentage: number | null;
  gas_price_updated_at: string;
  gas_prices: {
    slow: number;
    average: number;
    fast: number;
  };
  gas_prices_update_in: number;
  gas_used_today: string;
  market_cap: string;
  network_utilization_percentage: number;
  secondary_coin_image: string | null;
  secondary_coin_price: string | null;
  static_gas_price: string | null;
  total_addresses: string;
  total_blocks: string;
  total_gas_used: string;
  total_transactions: string;
  transactions_today: string;
  tvl: string | null;
}

export interface BlockscoutAddress {
  ens_domain_name: string | null;
  hash: string;
  implementations: unknown[];
  is_contract: boolean;
  is_scam: boolean;
  is_verified: boolean;
  metadata: unknown | null;
  name: string | null;
  private_tags: unknown[];
  proxy_type: string | null;
  public_tags: unknown[];
  watchlist_names: unknown[];
}

export interface BlockscoutBlock {
  base_fee_per_gas: string;
  burnt_fees: string;
  burnt_fees_percentage: number | null;
  difficulty: string;
  gas_limit: string;
  gas_target_percentage: number;
  gas_used: string;
  gas_used_percentage: number;
  hash: string;
  height: number;
  miner: BlockscoutAddress;
  nonce: string;
  parent_hash: string;
  priority_fee: number;
  rewards: unknown[];
  size: number;
  timestamp: string;
  total_difficulty: string | null;
  transaction_count: number;
  transaction_fees: string;
  type: string;
  uncles_hashes: string[];
  withdrawals_count: number | null;
}

export interface BlockscoutTransaction {
  priority_fee: string;
  tx_burnt_fee: string;
  raw_input: string;
  result: string;
  hash: string;
  max_fee_per_gas: string;
  revert_reason: string | null;
  confirmation_duration: [number, number];
  transaction_burnt_fee: string;
  type: number;
  token_transfers_overflow: boolean | null;
  confirmations: number;
  position: number;
  max_priority_fee_per_gas: string;
  transaction_tag: string | null;
  created_contract: BlockscoutAddress | null;
  value: string;
  from: BlockscoutAddress;
  gas_used: string;
  status: string;
  to: BlockscoutAddress | null;
  authorization_list: unknown[];
  method: string | null;
  fee: {
    type: string;
    value: string;
  };
  actions: unknown[];
  gas_limit: string;
  gas_price: string;
  decoded_input: unknown | null;
  token_transfers: unknown[] | null;
  base_fee_per_gas: string;
  timestamp: string;
  nonce: number;
  transaction_types: string[];
  exchange_rate: string | null;
  block_number: number;
  has_error_in_internal_transactions: boolean | null;
}

export interface BlockscoutAddressInfo {
  block_number_balance_updated_at: number | null;
  coin_balance: string | null;
  creation_transaction_hash: string | null;
  creator_address_hash: string | null;
  ens_domain_name: string | null;
  exchange_rate: string | null;
  has_beacon_chain_withdrawals: boolean;
  has_decompiled_code: boolean;
  has_logs: boolean;
  has_token_transfers: boolean;
  has_tokens: boolean;
  has_validated_blocks: boolean;
  hash: string;
  implementations: unknown[];
  is_contract: boolean;
  is_scam: boolean;
  is_verified: boolean;
  metadata: unknown | null;
  name: string | null;
  private_tags: unknown[];
  proxy_type: string | null;
  public_tags: unknown[];
  token: unknown | null;
  watchlist_address_id: number | null;
  watchlist_names: unknown[];
}

export interface BlockscoutPaginatedResponse<T> {
  items: T[];
  next_page_params: {
    block_number: number;
    index: number;
    items_count: number;
  } | null;
}

// API Error class
export class BlockscoutError extends Error {
  constructor(
    message: string,
    public status?: number,
    public endpoint?: string
  ) {
    super(message);
    this.name = 'BlockscoutError';
  }
}

// Fetch helper with error handling
async function fetchBlockscout<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${BLOCKSCOUT_API_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new BlockscoutError(
        `Blockscout API error: ${response.statusText}`,
        response.status,
        endpoint
      );
    }

    return response.json();
  } catch (error) {
    if (error instanceof BlockscoutError) throw error;
    throw new BlockscoutError(
      `Failed to fetch from Blockscout: ${error instanceof Error ? error.message : 'Unknown error'}`,
      undefined,
      endpoint
    );
  }
}

// API Methods
export const blockscoutApi = {
  /**
   * Get network statistics
   */
  async getStats(): Promise<BlockscoutStats> {
    return fetchBlockscout<BlockscoutStats>('/stats');
  },

  /**
   * Get recent blocks for main page
   */
  async getRecentBlocks(): Promise<BlockscoutBlock[]> {
    return fetchBlockscout<BlockscoutBlock[]>('/main-page/blocks');
  },

  /**
   * Get recent transactions for main page
   */
  async getRecentTransactions(): Promise<BlockscoutTransaction[]> {
    return fetchBlockscout<BlockscoutTransaction[]>('/main-page/transactions');
  },

  /**
   * Get block by number or hash
   */
  async getBlock(blockNumberOrHash: string | number): Promise<BlockscoutBlock> {
    return fetchBlockscout<BlockscoutBlock>(`/blocks/${blockNumberOrHash}`);
  },

  /**
   * Get transaction by hash
   */
  async getTransaction(hash: string): Promise<BlockscoutTransaction> {
    return fetchBlockscout<BlockscoutTransaction>(`/transactions/${hash}`);
  },

  /**
   * Get address info
   */
  async getAddress(address: string): Promise<BlockscoutAddressInfo> {
    return fetchBlockscout<BlockscoutAddressInfo>(`/addresses/${address}`);
  },

  /**
   * Get transactions for an address
   */
  async getAddressTransactions(
    address: string,
    params?: { page?: number; offset?: number }
  ): Promise<BlockscoutPaginatedResponse<BlockscoutTransaction>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.offset) searchParams.set('offset', params.offset.toString());

    const query = searchParams.toString();
    const endpoint = `/addresses/${address}/transactions${query ? `?${query}` : ''}`;

    return fetchBlockscout<BlockscoutPaginatedResponse<BlockscoutTransaction>>(endpoint);
  },

  /**
   * Get address token balances
   */
  async getAddressTokens(address: string): Promise<unknown[]> {
    return fetchBlockscout<unknown[]>(`/addresses/${address}/tokens`);
  },

  /**
   * Search for address, transaction, or block
   */
  async search(query: string): Promise<unknown> {
    return fetchBlockscout<unknown>(`/search?q=${encodeURIComponent(query)}`);
  },
};

// Export types
export type { BlockscoutStats as NetworkStats };
