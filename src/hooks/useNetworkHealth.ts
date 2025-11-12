'use client';

import { useQuery } from '@tanstack/react-query';
import { useBlockNumber } from 'wagmi';
import { usePublicClient } from 'wagmi';

export interface NetworkHealth {
  isOnline: boolean;
  blockNumber: bigint | null;
  gasPrice: bigint | null;
  gasPriceGwei: string;
  latency: number;
  lastUpdated: number;
  status: 'operational' | 'degraded' | 'offline' | 'maintenance';
}

export function useNetworkHealth() {
  const publicClient = usePublicClient();
  const { data: blockNumber } = useBlockNumber({
    watch: true,
    cacheTime: 10_000, // 10 seconds
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['network-health'],
    queryFn: async (): Promise<NetworkHealth> => {
      const startTime = Date.now();

      try {
        // Fetch gas price
        const gasPrice = await publicClient?.getGasPrice();
        const latency = Date.now() - startTime;

        // Convert gas price to Gwei
        const gasPriceGwei = gasPrice
          ? (Number(gasPrice) / 1e9).toFixed(4)
          : '0.0000';

        return {
          isOnline: true,
          blockNumber: blockNumber || null,
          gasPrice: gasPrice || null,
          gasPriceGwei,
          latency,
          lastUpdated: Date.now(),
          status: latency < 1000 ? 'operational' : 'degraded',
        };
      } catch (error) {
        console.error('Network health check failed:', error);
        return {
          isOnline: false,
          blockNumber: null,
          gasPrice: null,
          gasPriceGwei: '0.0000',
          latency: 0,
          lastUpdated: Date.now(),
          status: 'offline',
        };
      }
    },
    refetchInterval: 15_000, // Refetch every 15 seconds
    staleTime: 10_000, // 10 seconds
  });

  return {
    data: data || {
      isOnline: false,
      blockNumber: null,
      gasPrice: null,
      gasPriceGwei: '0.0000',
      latency: 0,
      lastUpdated: Date.now(),
      status: 'offline' as const,
    },
    isLoading,
    error,
  };
}
