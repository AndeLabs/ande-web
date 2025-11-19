'use client';

import { useQuery } from '@tanstack/react-query';
import { useBlockNumber, usePublicClient, useChainId } from 'wagmi';
import { formatGwei } from 'viem';

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

export function useNetworkHealth() {
  const publicClient = usePublicClient();
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
        if (!publicClient) {
          throw new Error('Public client not available');
        }

        // Fetch gas price with timeout
        const gasPrice = await Promise.race([
          publicClient.getGasPrice(),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Timeout')), 5000)
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
          blockNumber: blockNumber ?? null,
          gasPrice: gasPrice ?? null,
          gasPriceGwei,
          latency,
          lastUpdated: Date.now(),
          status,
          chainId,
        };
      } catch (err) {
        console.error('[ANDE] Network health check failed:', err);
        return {
          ...DEFAULT_HEALTH,
          lastUpdated: Date.now(),
          chainId,
        };
      }
    },
    refetchInterval: 10_000, // Refetch every 10 seconds
    staleTime: 5_000, // 5 seconds
    gcTime: 30_000, // Keep in cache for 30 seconds
    enabled: !!publicClient,
  });

  return {
    data: data || DEFAULT_HEALTH,
    isLoading,
    isError: !!error || blockError,
    error,
    refetch,
  };
}
