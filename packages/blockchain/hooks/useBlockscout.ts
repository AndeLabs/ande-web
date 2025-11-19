'use client';

import { useQuery } from '@tanstack/react-query';
import {
  blockscoutApi,
  BlockscoutStats,
  BlockscoutBlock,
  BlockscoutTransaction,
  BlockscoutAddressInfo,
  BlockscoutPaginatedResponse,
} from '../services/blockscout';

/**
 * Hook to fetch network statistics from Blockscout
 */
export function useBlockscoutStats() {
  return useQuery<BlockscoutStats>({
    queryKey: ['blockscout', 'stats'],
    queryFn: () => blockscoutApi.getStats(),
    refetchInterval: 10_000, // Refetch every 10 seconds
    staleTime: 5_000, // Consider stale after 5 seconds
  });
}

/**
 * Hook to fetch recent blocks
 */
export function useRecentBlocks() {
  return useQuery<BlockscoutBlock[]>({
    queryKey: ['blockscout', 'recent-blocks'],
    queryFn: () => blockscoutApi.getRecentBlocks(),
    refetchInterval: 5_000, // Refetch every 5 seconds (block time)
    staleTime: 3_000,
  });
}

/**
 * Hook to fetch recent transactions
 */
export function useRecentTransactions() {
  return useQuery<BlockscoutTransaction[]>({
    queryKey: ['blockscout', 'recent-transactions'],
    queryFn: () => blockscoutApi.getRecentTransactions(),
    refetchInterval: 10_000,
    staleTime: 5_000,
  });
}

/**
 * Hook to fetch a specific block
 */
export function useBlock(blockNumberOrHash: string | number | undefined) {
  return useQuery<BlockscoutBlock>({
    queryKey: ['blockscout', 'block', blockNumberOrHash],
    queryFn: () => blockscoutApi.getBlock(blockNumberOrHash!),
    enabled: !!blockNumberOrHash,
    staleTime: Infinity, // Blocks don't change
  });
}

/**
 * Hook to fetch a specific transaction
 */
export function useTransaction(hash: string | undefined) {
  return useQuery<BlockscoutTransaction>({
    queryKey: ['blockscout', 'transaction', hash],
    queryFn: () => blockscoutApi.getTransaction(hash!),
    enabled: !!hash,
    staleTime: 60_000, // Transactions rarely change after confirmation
  });
}

/**
 * Hook to fetch address info
 */
export function useAddressInfo(address: string | undefined) {
  return useQuery<BlockscoutAddressInfo>({
    queryKey: ['blockscout', 'address', address],
    queryFn: () => blockscoutApi.getAddress(address!),
    enabled: !!address,
    staleTime: 30_000,
  });
}

/**
 * Hook to fetch transactions for an address
 */
export function useAddressTransactions(
  address: string | undefined,
  page?: number
) {
  return useQuery<BlockscoutPaginatedResponse<BlockscoutTransaction>>({
    queryKey: ['blockscout', 'address-transactions', address, page],
    queryFn: () => blockscoutApi.getAddressTransactions(address!, { page }),
    enabled: !!address,
    staleTime: 10_000,
  });
}

/**
 * Computed stats from Blockscout data
 */
export function useNetworkMetrics() {
  const { data: stats, isLoading, error } = useBlockscoutStats();
  const { data: recentBlocks } = useRecentBlocks();

  // Calculate TPS from recent blocks
  const calculateTPS = () => {
    if (!recentBlocks || recentBlocks.length < 2) return 0;

    const totalTx = recentBlocks.reduce((sum, block) => sum + block.transaction_count, 0);
    const timeSpan = recentBlocks.length * 5; // ~5 seconds per block

    return totalTx / timeSpan;
  };

  return {
    isLoading,
    error,
    stats: stats
      ? {
          totalBlocks: parseInt(stats.total_blocks),
          totalTransactions: parseInt(stats.total_transactions),
          totalAddresses: parseInt(stats.total_addresses),
          avgBlockTime: stats.average_block_time / 1000, // Convert to seconds
          gasPrice: stats.gas_prices.average,
          networkUtilization: stats.network_utilization_percentage,
          transactionsToday: parseInt(stats.transactions_today),
          gasUsedToday: stats.gas_used_today,
          tps: calculateTPS(),
        }
      : null,
  };
}
