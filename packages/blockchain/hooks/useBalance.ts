'use client';
import { useBalance as useWagmiBalance } from 'wagmi';
import { formatUnits } from 'viem';
import { useAccount } from 'wagmi';
import { useMemo } from 'react';

export function useBalance() {
    const { address } = useAccount();
    const { data, ...rest } = useWagmiBalance({
        address: address,
        query: {
            refetchInterval: 5000,
        }
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
    };
}
