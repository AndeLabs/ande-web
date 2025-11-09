'use client';

import { useAccount, useReadContracts, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { AndeNativeStakingAddress } from '../config/contracts';
import { parseEther, formatUnits } from 'viem';
import { useMemo } from 'react';

/**
 * Staking Pool Configuration
 * Defines the three staking tiers with their IDs and base APR
 */
type PoolName = 'light' | 'medium' | 'heavy';
export type StakingPoolName = PoolName;

const POOLS: Record<PoolName, { id: number; name: string; apr: number; lockMultiplier: number }> = {
    light: { id: 0, name: 'Light (1x lock)', apr: 5, lockMultiplier: 1 },
    medium: { id: 1, name: 'Medium (2x lock)', apr: 12, lockMultiplier: 2 },
    heavy: { id: 2, name: 'Heavy (3x lock)', apr: 25, lockMultiplier: 3 },
};

/**
 * AndeNativeStaking Contract ABI - Read Functions
 * Only includes read functions for data fetching
 */
const STAKING_READ_ABI = [
    {
        type: 'function',
        name: 'getStakedAmount',
        inputs: [
            { name: 'user', type: 'address' },
            { name: 'poolId', type: 'uint8' },
        ],
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'getEarnedRewards',
        inputs: [
            { name: 'user', type: 'address' },
            { name: 'poolId', type: 'uint8' },
        ],
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
    },
] as const;

/**
 * AndeNativeStaking Contract ABI - Write Functions
 * Only includes write functions for transactions
 */
const STAKING_WRITE_ABI = [
    {
        type: 'function',
        name: 'stake',
        inputs: [
            { name: 'amount', type: 'uint256' },
            { name: 'poolId', type: 'uint8' },
        ],
        outputs: [],
        stateMutability: 'payable',
    },
    {
        type: 'function',
        name: 'unstake',
        inputs: [
            { name: 'amount', type: 'uint256' },
            { name: 'poolId', type: 'uint8' },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'claimRewards',
        inputs: [{ name: 'poolId', type: 'uint8' }],
        outputs: [],
        stateMutability: 'nonpayable',
    },
] as const;

const stakingContract = {
    address: AndeNativeStakingAddress,
} as const;

/**
 * useStaking Hook
 * 
 * Provides comprehensive staking functionality:
 * - Read staked amounts for all pools (multicall for efficiency)
 * - Read earned rewards for all pools
 * - Write functions for stake, unstake, and claim rewards
 * - Transaction state management and confirmation tracking
 * 
 * @returns Staking interface with data and write functions
 */
export function useStaking() {
    const { address } = useAccount();
    const { 
        writeContractAsync, 
        data: hash, 
        error: writeError, 
        isPending: isWritePending,
        reset: resetWrite,
    } = useWriteContract();

    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ 
        hash, 
    });

    /**
     * Multicall: Fetch staked amounts and rewards for all pools in a single RPC call
     * This is significantly more efficient than three separate calls
     */
    const { 
        data: multicallData, 
        isLoading: isStakingDataLoading, 
        isError: isStakingDataError,
        error: dataError,
    } = useReadContracts({
        contracts: [
            // Light pool staked amount
            {
                ...stakingContract,
                abi: STAKING_READ_ABI,
                functionName: 'getStakedAmount',
                args: [address as `0x${string}`, POOLS.light.id],
            },
            // Medium pool staked amount
            {
                ...stakingContract,
                abi: STAKING_READ_ABI,
                functionName: 'getStakedAmount',
                args: [address as `0x${string}`, POOLS.medium.id],
            },
            // Heavy pool staked amount
            {
                ...stakingContract,
                abi: STAKING_READ_ABI,
                functionName: 'getStakedAmount',
                args: [address as `0x${string}`, POOLS.heavy.id],
            },
            // Light pool rewards
            {
                ...stakingContract,
                abi: STAKING_READ_ABI,
                functionName: 'getEarnedRewards',
                args: [address as `0x${string}`, POOLS.light.id],
            },
            // Medium pool rewards
            {
                ...stakingContract,
                abi: STAKING_READ_ABI,
                functionName: 'getEarnedRewards',
                args: [address as `0x${string}`, POOLS.medium.id],
            },
            // Heavy pool rewards
            {
                ...stakingContract,
                abi: STAKING_READ_ABI,
                functionName: 'getEarnedRewards',
                args: [address as `0x${string}`, POOLS.heavy.id],
            },
        ],
        query: {
            enabled: !!address,
        }
    });

    /**
     * Memoized formatted data for display
     * Converts BigInt values to decimal strings
     */
    const formattedData = useMemo(() => {
        if (!multicallData) return null;
        
        return {
            staked: {
                light: multicallData[0]?.result ? formatUnits(multicallData[0].result, 18) : '0',
                medium: multicallData[1]?.result ? formatUnits(multicallData[1].result, 18) : '0',
                heavy: multicallData[2]?.result ? formatUnits(multicallData[2].result, 18) : '0',
            },
            rewards: {
                light: multicallData[3]?.result ? formatUnits(multicallData[3].result, 18) : '0',
                medium: multicallData[4]?.result ? formatUnits(multicallData[4].result, 18) : '0',
                heavy: multicallData[5]?.result ? formatUnits(multicallData[5].result, 18) : '0',
            },
        };
    }, [multicallData]);

    /**
     * Stake ANDE tokens in a specific pool
     */
    const stake = async ({ pool, amount }: { pool: PoolName; amount: string }) => {
        const poolId = POOLS[pool].id;
        return await writeContractAsync({
            ...stakingContract,
            abi: STAKING_WRITE_ABI,
            functionName: 'stake',
            args: [parseEther(amount), poolId],
            value: parseEther(amount),
        });
    };

    /**
     * Unstake ANDE tokens from a specific pool
     */
    const unstake = async ({ pool, amount }: { pool: PoolName; amount: string }) => {
        const poolId = POOLS[pool].id;
        return await writeContractAsync({
            ...stakingContract,
            abi: STAKING_WRITE_ABI,
            functionName: 'unstake',
            args: [parseEther(amount), poolId],
        });
    };

    /**
     * Claim earned rewards from a specific pool
     */
    const claimRewards = async ({ pool }: { pool: PoolName }) => {
        const poolId = POOLS[pool].id;
        return await writeContractAsync({
            ...stakingContract,
            abi: STAKING_WRITE_ABI,
            functionName: 'claimRewards',
            args: [poolId],
        });
    };
    
    const isLoading = isStakingDataLoading || isWritePending || isConfirming;
    const isError = isStakingDataError || !!writeError;

    return {
        // Write functions
        stake,
        unstake,
        claimRewards,
        
        // Raw data
        stakingData: {
            light: multicallData?.[0]?.result,
            medium: multicallData?.[1]?.result,
            heavy: multicallData?.[2]?.result,
        },
        earnedRewards: {
            light: multicallData?.[3]?.result,
            medium: multicallData?.[4]?.result,
            heavy: multicallData?.[5]?.result,
        },
        
        // Formatted data for display
        formatted: formattedData,
        
        // Pool configuration
        pools: POOLS,
        
        // State management
        isLoading,
        isError,
        isConfirmed,
        isPending: isWritePending,
        isConfirming,
        hash,
        error: writeError,
        dataError,
        
        // Utilities
        resetWrite,
    };
}
