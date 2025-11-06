'use client';
import { useGasPrice as useWagmiGasPrice } from 'wagmi';

export function useGasPrice() {
    return useWagmiGasPrice({
        query: {
            refetchInterval: 10000, // every 10 seconds
        }
    });
}
