'use client';
import { useReadContract, useWriteContract, useAccount } from 'wagmi';
import { andeGovernorABI, andeGovernorAddress } from '../config/contracts';

export function useGovernance() {
    const { address } = useAccount();
    const { writeContractAsync } = useWriteContract();

    // TODO: Implement fetching of proposals with pagination
    const proposals = { data: [], isLoading: true, isError: false }; // Placeholder

    // TODO: Implement fetching of voting power
    const votingPower = { data: '0', isLoading: true, isError: false }; // Placeholder

    const createProposal = async (targets: `0x${string}`[], values: bigint[], calldatas: `0x${string}`[], description: string) => {
        return writeContractAsync({
            abi: andeGovernorABI,
            address: andeGovernorAddress as `0x${string}`,
            functionName: 'propose',
            args: [targets, values, calldatas, description],
        });
    };

    const vote = async (proposalId: bigint, support: 0 | 1 | 2) => {
        return writeContractAsync({
            abi: andeGovernorABI,
            address: andeGovernorAddress as `0x${string}`,
            functionName: 'vote',
            args: [proposalId, support],
        });
    };

    return {
        proposals,
        votingPower,
        createProposal,
        vote,
    };
}
