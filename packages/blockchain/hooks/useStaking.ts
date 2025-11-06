'use client';

import { useAccount, useReadContracts, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { andeNativeStakingABI, andeNativeStakingAddress } from '../config/contracts';
import { parseEther } from 'viem';

type PoolName = 'light' | 'medium' | 'heavy';
export type StakingPoolName = PoolName;

const POOLS: Record<PoolName, { id: number; apr: number }> = {
    light: { id: 0, apr: 5 },
    medium: { id: 1, apr: 12 },
    heavy: { id: 2, apr: 25 },
};

const stakingContract = {
    address: andeNativeStakingAddress,
    abi: andeNativeStakingABI,
} as const;


export function useStaking() {
    const { address } = useAccount();
    const { writeContractAsync, data: hash, error: writeError, isPending: isWritePending } = useWriteContract();

    const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ 
      hash, 
    });

    // CRITICAL: Multicall Implementation
    // This hook makes a single RPC request to fetch data for all three pools,
    // which is significantly more performant than making three separate requests.
    const { data: multicallData, isLoading: isStakingDataLoading, isError: isStakingDataError } = useReadContracts({
        contracts: [
            {
                ...stakingContract,
                functionName: 'getStakedAmount',
                args: [address!, BigInt(POOLS.light.id)],
            },
            {
                ...stakingContract,
                functionName: 'getStakedAmount',
                args: [address!, BigInt(POOLS.medium.id)],
            },
            {
                ...stakingContract,
                functionName: 'getStakedAmount',
                args: [address!, BigInt(POOLS.heavy.id)],
            },
             // TODO: Add earned rewards calls here when contract supports it
        ],
        query: {
            enabled: !!address,
            // Polling is handled by `watch:true` in parent components now
            // refetchInterval: 10000, 
        }
    });

    const stake = async ({ pool, amount }: { pool: PoolName; amount: string }) => {
        const poolId = POOLS[pool].id;
        return await writeContractAsync({
            ...stakingContract,
            functionName: 'stake',
            args: [parseEther(amount), BigInt(poolId)],
            value: parseEther(amount)
        });
    };

    const unstake = async ({ pool, amount }: { pool: PoolName; amount: string }) => {
        const poolId = POOLS[pool].id;
        return await writeContractAsync({
            ...stakingContract,
            functionName: 'unstake',
            args: [parseEther(amount), BigInt(poolId)],
        });
    };

    const claimRewards = async ({ pool }: { pool: PoolName }) => {
        const poolId = POOLS[pool].id;
        return await writeContractAsync({
            ...stakingContract,
            functionName: 'claimRewards',
            args: [BigInt(poolId)],
        });
    };
    
    const isLoading = isStakingDataLoading || isWritePending || isConfirming;
    const isError = isStakingDataError || !!writeError;

    return {
        stake,
        unstake,
        claimRewards,
        stakingData: {
            light: multicallData?.[0]?.result as bigint | undefined,
            medium: multicallData?.[1]?.result as bigint | undefined,
            heavy: multicallData?.[2]?.result as bigint | undefined,
        },
        earnedRewards: {
            // Placeholder - to be replaced with multicall results
            light: BigInt(0),
            medium: BigInt(0),
            heavy: BigInt(0),
        },
        pools: POOLS,
        isLoading,
        isError,
        isConfirmed,
        hash,
        error: writeError,
    };
}
