// This file can be expanded with generated types from contract ABIs
// using tools like `wagmi generate`.

export type Pool = {
    id: number;
    apr: number;
    stakedAmount: bigint;
    rewards: bigint;
}

export type Proposal = {
    id: bigint;
    description: string;
    proposer: `0x_string`;
    status: 'pending' | 'active' | 'succeeded' | 'defeated' | 'executed';
    forVotes: bigint;
    againstVotes: bigint;
    abstainVotes: bigint;
}
