'use client';

import { useQuery } from '@tanstack/react-query';
import { useBlockNumber, useChainId } from 'wagmi';
import { formatGwei, createPublicClient, http } from 'viem';
import { andeNetwork } from '../../packages/blockchain/config/chains';

export interface NetworkHealth {
  isOnline: boolean;
  blockNumber: bigint | null;
  gasPrice: bigint | null;
  gasPriceGwei: string;
  latency: number;
  lastUpdated: number;
  status: 'operational' | 'degraded' | 'offline' | 'maintenance';
  chainId: number | null;
}

const DEFAULT_HEALTH: NetworkHealth = {
  isOnline: false,
  blockNumber: null,
  gasPrice: null,
  gasPriceGwei: '0.0000',
  latency: 0,
  lastUpdated: Date.now(),
  status: 'offline',
  chainId: null,
};

// Create a standalone public client for health checks
const healthCheckClient = createPublicClient({
  chain: andeNetwork,
  transport: http(andeNetwork.rpcUrls.default.http[0], {
    timeout: 10000,
  }),
});

export function useNetworkHealth() {
  const chainId = useChainId();

  const { data: blockNumber, isError: blockError } = useBlockNumber({
    watch: true,
    query: {
      staleTime: 5_000,
      gcTime: 10_000,
    },
  });

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['network-health', chainId],
    queryFn: async (): Promise<NetworkHealth> => {
      const startTime = Date.now();

      try {
        // Fetch block number and gas price with timeout
        const [currentBlock, gasPrice] = await Promise.race([
          Promise.all([
            healthCheckClient.getBlockNumber(),
            healthCheckClient.getGasPrice(),
          ]),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Timeout')), 8000)
          ),
        ]);

        const latency = Date.now() - startTime;

        // Convert gas price to Gwei
        const gasPriceGwei = gasPrice
          ? formatGwei(gasPrice)
          : '0.0000';

        // Determine status based on latency
        let status: NetworkHealth['status'] = 'operational';
        if (latency > 2000) status = 'degraded';
        if (latency > 5000) status = 'offline';

        return {
          isOnline: true,
          blockNumber: blockNumber ?? currentBlock ?? null,
          gasPrice: gasPrice ?? null,
          gasPriceGwei,
          latency,
          lastUpdated: Date.now(),
          status,
          chainId: chainId || 6174,
        };
      } catch (err) {
        console.error('[ANDE] Network health check failed:', err);
        return {
          ...DEFAULT_HEALTH,
          lastUpdated: Date.now(),
          chainId: chainId || 6174,
        };
      }
    },
    refetchInterval: 10_000, // Refetch every 10 seconds
    staleTime: 5_000, // 5 seconds
    gcTime: 30_000, // Keep in cache for 30 seconds
  });

  return {
    data: data || DEFAULT_HEALTH,
    isLoading,
    isError: !!error || blockError,
    error,
    refetch,
  };
}
