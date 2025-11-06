'use client';

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { andeNativeStakingABI, andeNativeStakingAddress } from '../config/contracts';
import { parseEther, formatEther } from 'viem';

type PoolName = 'light' | 'medium' | 'heavy';
type PoolId = 0 | 1 | 2;

const POOLS: Record<PoolName, { id: PoolId; apr: number }> = {
    light: { id: 0, apr: 5 },
    medium: { id: 1, apr: 12 },
    heavy: { id: 2, apr: 25 },
};

export function useStaking() {
    const { address } = useAccount();
    const { writeContractAsync, data: hash, error: writeError, isPending: isWritePending } = useWriteContract();

    const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ 
      hash, 
    });


    const getStakedAmount = (poolId: PoolId) => {
        return useReadContract({
            abi: andeNativeStakingABI,
            address: andeNativeStakingAddress,
            functionName: 'getStakedAmount',
            args: [address!, BigInt(poolId)],
            query: { enabled: !!address, refetchInterval: 5000 },
        });
    }

    const lightPoolQuery = getStakedAmount(POOLS.light.id);
    const mediumPoolQuery = getStakedAmount(POOLS.medium.id);
    const heavyPoolQuery = getStakedAmount(POOLS.heavy.id);

    const stake = async ({ pool, amount }: { pool: PoolName; amount: string }) => {
        const poolId = POOLS[pool].id;
        return await writeContractAsync({
            abi: andeNativeStakingABI,
            address: andeNativeStakingAddress,
            functionName: 'stake',
            args: [parseEther(amount), BigInt(poolId)],
            value: parseEther(amount)
        });
    };

    const unstake = async ({ pool, amount }: { pool: PoolName; amount: string }) => {
        const poolId = POOLS[pool].id;
        return await writeContractAsync({
            abi: andeNativeStakingABI,
            address: andeNativeStakingAddress,
            functionName: 'unstake',
            args: [parseEther(amount), BigInt(poolId)],
        });
    };

    const claimRewards = async ({ pool }: { pool: PoolName }) => {
        const poolId = POOLS[pool].id;
        return await writeContractAsync({
            abi: andeNativeStakingABI,
            address: andeNativeStakingAddress,
            functionName: 'claimRewards',
            args: [BigInt(poolId)],
        });
    };
    
    // Placeholder for earned rewards - requires contract support
    const earnedRewards = (poolId: PoolId) => {
        return { data: BigInt(0), isLoading: false }; // Placeholder
    }
    
    const isLoading = lightPoolQuery.isLoading || mediumPoolQuery.isLoading || heavyPoolQuery.isLoading || isWritePending || isConfirming;
    const isError = lightPoolQuery.isError || mediumPoolQuery.isError || heavyPoolQuery.isError || !!writeError;

    return {
        stake,
        unstake,
        claimRewards,
        stakingData: {
            light: lightPoolQuery.data,
            medium: mediumPoolQuery.data,
            heavy: heavyPoolQuery.data,
        },
        earnedRewards: {
            light: earnedRewards(POOLS.light.id).data,
            medium: earnedRewards(POOLS.medium.id).data,
            heavy: earnedRewards(POOLS.heavy.id).data,
        },
        pools: POOLS,
        isLoading,
        isError,
        isConfirmed,
        hash,
        error: writeError,
    };
}
