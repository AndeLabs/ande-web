'use client';

import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { andeNativeStakingABI, andeNativeStakingAddress } from '../config/contracts';
import { parseEther } from 'viem';

const POOLS = {
    LIGHT: { id: 0, apr: 5 },
    MEDIUM: { id: 1, apr: 12 },
    HEAVY: { id: 2, apr: 25 },
};

export function useStaking() {
    const { address } = useAccount();
    const { writeContractAsync } = useWriteContract();

    // TODO: Implement logic for fetching all staking data, including rewards and APY
    const lightPoolStaked = useReadContract({
        abi: andeNativeStakingABI,
        address: andeNativeStakingAddress,
        functionName: 'getStakedAmount',
        args: [address!, BigInt(POOLS.LIGHT.id)],
        query: { enabled: !!address },
    });
    
    const mediumPoolStaked = useReadContract({
        abi: andeNativeStakingABI,
        address: andeNativeStakingAddress,
        functionName: 'getStakedAmount',
        args: [address!, BigInt(POOLS.MEDIUM.id)],
        query: { enabled: !!address },
    });

    const heavyPoolStaked = useReadContract({
        abi: andeNativeStakingABI,
        address: andeNativeStakingAddress,
        functionName: 'getStakedAmount',
        args: [address!, BigInt(POOLS.HEAVY.id)],
        query: { enabled: !!address },
    });


    const stake = async (amount: string, poolId: 0 | 1 | 2) => {
        return await writeContractAsync({
            abi: andeNativeStakingABI,
            address: andeNativeStakingAddress,
            functionName: 'stake',
            args: [parseEther(amount), BigInt(poolId)],
            value: parseEther(amount)
        });
    };

    const unstake = async (amount: string, poolId: 0 | 1 | 2) => {
        return await writeContractAsync({
            abi: andeNativeStakingABI,
            address: andeNativeStakingAddress,
            functionName: 'unstake',
            args: [parseEther(amount), BigInt(poolId)],
        });
    };

    const claimRewards = async (poolId: 0 | 1 | 2) => {
        return await writeContractAsync({
            abi: andeNativeStakingABI,
            address: andeNativeStakingAddress,
            functionName: 'claimRewards',
            args: [BigInt(poolId)],
        });
    };

    return {
        stake,
        unstake,
        claimRewards,
        stakingData: {
            light: lightPoolStaked.data,
            medium: mediumPoolStaked.data,
            heavy: heavyPoolStaked.data,
        },
        pools: POOLS,
    };
}
