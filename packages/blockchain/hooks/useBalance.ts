'use client';

import { useBalance as useWagmiBalance, useAccount } from 'wagmi';
import { useReadContract } from 'wagmi';
import { formatUnits } from 'viem';
import { useMemo } from 'react';
import { ANDETokenDualityAddress } from '../config/contracts';
import { loadContractABI } from '../utils/abi-loader';

/**
 * Hook para obtener el balance nativo (ANDE)
 * Usa wagmi's useBalance para el balance nativo de la cadena
 */
export function useBalance() {
    const { address } = useAccount();
    const { data, isLoading, isError, ...rest } = useWagmiBalance({
        address: address,
        query: {
            enabled: !!address,
        },
    });

    const formattedBalance = useMemo(() => {
        if (data?.value) {
            return formatUnits(data.value, data.decimals);
        }
        return '0';
    }, [data]);

    return {
        ...rest,
        balance: data,
        formattedBalance,
        isLoading,
        isError,
    };
}

/**
 * Hook para obtener el balance de token ANDE (ERC20)
 * Lee directamente del contrato desplegado
 */
export function useANDETokenBalance(userAddress?: string) {
    const { address } = useAccount();
    const targetAddress = userAddress || address;

    const { data, isLoading, isError, error } = useReadContract({
        address: ANDETokenDualityAddress,
        abi: [
            {
                type: 'function',
                name: 'balanceOf',
                inputs: [{ name: 'account', type: 'address' }],
                outputs: [{ name: '', type: 'uint256' }],
                stateMutability: 'view',
            },
        ] as const,
        functionName: 'balanceOf',
        args: [targetAddress as `0x${string}`],
        query: {
            enabled: !!targetAddress,
        },
    });

    const formattedBalance = useMemo(() => {
        if (data) {
            // ANDE token is 18 decimals
            return formatUnits(BigInt(data), 18);
        }
        return '0';
    }, [data]);

    return {
        balance: data,
        formattedBalance,
        isLoading,
        isError,
        error,
        rawBalance: data ? BigInt(data) : 0n,
    };
}
