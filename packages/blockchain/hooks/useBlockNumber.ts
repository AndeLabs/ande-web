'use client';
import { useBlockNumber as useWagmiBlockNumber } from 'wagmi';

export function useBlockNumber() {
    return useWagmiBlockNumber({ watch: true });
}
