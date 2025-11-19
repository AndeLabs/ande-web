'use client';

import { useWriteContract, useAccount } from 'wagmi';
import { AndeGovernorAddress } from '../config/contracts';

/**
 * Governor Contract ABI (minimal for basic operations)
 * Full ABI will be loaded when governance is fully deployed
 */
const GOVERNOR_ABI = [
  {
    type: 'function',
    name: 'propose',
    inputs: [
      { name: 'targets', type: 'address[]' },
      { name: 'values', type: 'uint256[]' },
      { name: 'calldatas', type: 'bytes[]' },
      { name: 'description', type: 'string' },
    ],
    outputs: [{ name: 'proposalId', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'castVote',
    inputs: [
      { name: 'proposalId', type: 'uint256' },
      { name: 'support', type: 'uint8' },
    ],
    outputs: [{ name: 'balance', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'getVotes',
    inputs: [
      { name: 'account', type: 'address' },
      { name: 'timepoint', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
] as const;

/**
 * useGovernance Hook
 *
 * Provides governance functionality for ANDE Network
 * Note: Governor contract pending full deployment
 */
export function useGovernance() {
  const { address } = useAccount();
  const { writeContractAsync, isPending, error } = useWriteContract();

  // Placeholder data until governor is fully deployed
  const proposals = {
    data: [] as never[],
    isLoading: false,
    isError: false,
  };

  const votingPower = {
    data: '0',
    isLoading: false,
    isError: false,
  };

  const createProposal = async (
    targets: `0x${string}`[],
    values: bigint[],
    calldatas: `0x${string}`[],
    description: string
  ) => {
    if (!AndeGovernorAddress || AndeGovernorAddress === '0x0000000000000000000000000000000000000') {
      throw new Error('Governor contract not yet deployed');
    }

    return writeContractAsync({
      abi: GOVERNOR_ABI,
      address: AndeGovernorAddress as `0x${string}`,
      functionName: 'propose',
      args: [targets, values, calldatas, description],
    });
  };

  const vote = async (proposalId: bigint, support: 0 | 1 | 2) => {
    if (!AndeGovernorAddress || AndeGovernorAddress === '0x0000000000000000000000000000000000000') {
      throw new Error('Governor contract not yet deployed');
    }

    return writeContractAsync({
      abi: GOVERNOR_ABI,
      address: AndeGovernorAddress as `0x${string}`,
      functionName: 'castVote',
      args: [proposalId, support],
    });
  };

  return {
    proposals,
    votingPower,
    createProposal,
    vote,
    isLoading: isPending,
    error,
    isGovernorDeployed: !!AndeGovernorAddress && AndeGovernorAddress !== '0x0000000000000000000000000000000000000',
  };
}
