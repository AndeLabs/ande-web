'use client';

import { useAccount, useReadContracts, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { AndeSequencerRegistryAddress } from '../config/contracts';
import { formatUnits } from 'viem';
import { useMemo } from 'react';

/**
 * Phase enum matching smart contract
 */
export enum SequencerPhase {
    GENESIS = 0,
    DUAL = 1,
    MULTI = 2,
    DECENTRALIZED = 3,
}

/**
 * Sequencer Info structure
 */
export interface SequencerInfo {
    addr: string;
    stakedAmount: bigint;
    joinedEpoch: bigint;
    blocksProduced: bigint;
    uptimePercentage: bigint;
    isActive: boolean;
    isPermanent: boolean;
    metadata: string;
}

/**
 * AndeSequencerRegistry Contract ABI - Read Functions
 */
const SEQUENCER_READ_ABI = [
    {
        type: 'function',
        name: 'getCurrentLeader',
        inputs: [],
        outputs: [{ name: '', type: 'address' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'getActiveSequencers',
        inputs: [],
        outputs: [{ name: '', type: 'address[]' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'getActiveSequencersCount',
        inputs: [],
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'currentPhase',
        inputs: [],
        outputs: [{ name: '', type: 'uint8' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'currentEpoch',
        inputs: [],
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'getPhaseRequirements',
        inputs: [],
        outputs: [
            { name: 'minStake', type: 'uint256' },
            { name: 'maxSequencers', type: 'uint256' },
            { name: 'minUptime', type: 'uint256' },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'getSequencerInfo',
        inputs: [{ name: 'sequencer', type: 'address' }],
        outputs: [
            {
                name: '',
                type: 'tuple',
                components: [
                    { name: 'addr', type: 'address' },
                    { name: 'stakedAmount', type: 'uint256' },
                    { name: 'joinedEpoch', type: 'uint256' },
                    { name: 'blocksProduced', type: 'uint256' },
                    { name: 'uptimePercentage', type: 'uint256' },
                    { name: 'isActive', type: 'bool' },
                    { name: 'isPermanent', type: 'bool' },
                    { name: 'metadata', type: 'string' },
                ],
            },
        ],
        stateMutability: 'view',
    },
] as const;

/**
 * AndeSequencerRegistry Contract ABI - Write Functions
 */
const SEQUENCER_WRITE_ABI = [
    {
        type: 'function',
        name: 'registerSequencer',
        inputs: [
            { name: 'sequencer', type: 'address' },
            { name: 'stake', type: 'uint256' },
            { name: 'metadata', type: 'string' },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'removeSequencer',
        inputs: [
            { name: 'sequencer', type: 'address' },
            { name: 'reason', type: 'string' },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'recordBlockProduced',
        inputs: [{ name: 'sequencer', type: 'address' }],
        outputs: [],
        stateMutability: 'nonpayable',
    },
] as const;

const sequencerContract = {
    address: AndeSequencerRegistryAddress,
} as const;

/**
 * useSequencer Hook
 * 
 * Provides comprehensive sequencer registry functionality:
 * - Read current leader and active sequencers
 * - Read current phase and epoch
 * - Read phase requirements (min stake, max sequencers, etc.)
 * - Read individual sequencer info
 * - Write functions for registering and removing sequencers
 * 
 * @returns Sequencer registry interface with data and write functions
 */
export function useSequencer(sequencerAddress?: string) {
    const { address } = useAccount();
    const targetAddress = sequencerAddress || address;

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
     * Multicall: Fetch all sequencer registry data in a single RPC call
     */
    const { 
        data: multicallData, 
        isLoading: isDataLoading, 
        isError: isDataError,
        error: dataError,
    } = useReadContracts({
        contracts: [
            // Current leader
            {
                ...sequencerContract,
                abi: SEQUENCER_READ_ABI,
                functionName: 'getCurrentLeader',
            },
            // Active sequencers count
            {
                ...sequencerContract,
                abi: SEQUENCER_READ_ABI,
                functionName: 'getActiveSequencersCount',
            },
            // Current phase
            {
                ...sequencerContract,
                abi: SEQUENCER_READ_ABI,
                functionName: 'currentPhase',
            },
            // Current epoch
            {
                ...sequencerContract,
                abi: SEQUENCER_READ_ABI,
                functionName: 'currentEpoch',
            },
            // Phase requirements
            {
                ...sequencerContract,
                abi: SEQUENCER_READ_ABI,
                functionName: 'getPhaseRequirements',
            },
            // Target sequencer info (if address provided)
            ...(targetAddress ? [{
                ...sequencerContract,
                abi: SEQUENCER_READ_ABI,
                functionName: 'getSequencerInfo',
                args: [targetAddress as `0x${string}`],
            }] : []),
        ],
        query: {
            enabled: true,
        }
    });

    /**
     * Memoized formatted data
     */
    const formattedData = useMemo(() => {
        if (!multicallData) return null;

        const currentLeader = multicallData[0]?.result as string | undefined;
        const activeCount = multicallData[1]?.result as bigint | undefined;
        const phase = multicallData[2]?.result as number | undefined;
        const epoch = multicallData[3]?.result as bigint | undefined;
        const phaseReqs = multicallData[4]?.result as [bigint, bigint, bigint] | undefined;
        const sequencerInfo = targetAddress ? multicallData[5]?.result as SequencerInfo | undefined : undefined;

        return {
            currentLeader,
            activeCount: activeCount ? Number(activeCount) : 0,
            phase: phase as SequencerPhase | undefined,
            epoch: epoch ? Number(epoch) : 0,
            phaseRequirements: phaseReqs ? {
                minStake: phaseReqs[0],
                maxSequencers: phaseReqs[1],
                minUptimePercentage: phaseReqs[2],
                minStakeFormatted: phaseReqs[0] ? formatUnits(phaseReqs[0], 18) : '0',
            } : null,
            sequencerInfo,
            isLeader: currentLeader?.toLowerCase() === targetAddress?.toLowerCase(),
        };
    }, [multicallData, targetAddress]);

    /**
     * Register a new sequencer
     */
    const registerSequencer = async ({
        sequencer,
        stake,
        metadata,
    }: {
        sequencer: string;
        stake: bigint;
        metadata: string;
    }) => {
        return await writeContractAsync({
            ...sequencerContract,
            abi: SEQUENCER_WRITE_ABI,
            functionName: 'registerSequencer',
            args: [sequencer as `0x${string}`, stake, metadata],
        });
    };

    /**
     * Remove a sequencer
     */
    const removeSequencer = async ({
        sequencer,
        reason,
    }: {
        sequencer: string;
        reason: string;
    }) => {
        return await writeContractAsync({
            ...sequencerContract,
            abi: SEQUENCER_WRITE_ABI,
            functionName: 'removeSequencer',
            args: [sequencer as `0x${string}`, reason],
        });
    };

    /**
     * Record block produced by sequencer
     */
    const recordBlockProduced = async (sequencer: string) => {
        return await writeContractAsync({
            ...sequencerContract,
            abi: SEQUENCER_WRITE_ABI,
            functionName: 'recordBlockProduced',
            args: [sequencer as `0x${string}`],
        });
    };

    const isLoading = isDataLoading || isWritePending || isConfirming;
    const isError = isDataError || !!writeError;

    return {
        // Write functions
        registerSequencer,
        removeSequencer,
        recordBlockProduced,

        // Raw data
        currentLeader: multicallData?.[0]?.result as string | undefined,
        activeSequencersCount: multicallData?.[1]?.result as bigint | undefined,
        currentPhase: multicallData?.[2]?.result as number | undefined,
        currentEpoch: multicallData?.[3]?.result as bigint | undefined,
        phaseRequirements: multicallData?.[4]?.result as [bigint, bigint, bigint] | undefined,
        sequencerInfo: targetAddress ? multicallData?.[5]?.result as SequencerInfo | undefined : undefined,

        // Formatted data
        formatted: formattedData,

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
