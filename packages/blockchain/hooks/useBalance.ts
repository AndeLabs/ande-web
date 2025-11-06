'use client';
import { useBalance as useWagmiBalance, useAccount } from 'wagmi';
import { formatUnits } from 'viem';
import { useMemo } from 'react';

export function useBalance() {
    const { address } = useAccount();
    const { data, ...rest } = useWagmiBalance({
        address: address,
        query: {
            // watch: true is more efficient than refetchInterval
            // as it uses websockets if available
            enabled: !!address,
        },
    });

    const formattedBalance = useMemo(() => {
        if (data?.value) {
            // Note: wagmi's useBalance `value` is a BigInt, formatUnits expects it
            return formatUnits(data.value, data.decimals);
        }
        return '0';
    }, [data]);

    return {
        ...rest,
        balance: data,
        // The formattedBalance string is convenient for display
        formattedBalance,
    };
}
