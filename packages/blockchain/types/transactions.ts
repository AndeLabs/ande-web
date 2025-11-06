export type Transaction = {
    hash: `0x${string}`;
    from: `0x${string}`;
    to: `0x${string}` | null;
    value: bigint;
    blockNumber: bigint | null;
    timestamp: bigint;
    status: 'success' | 'reverted';
    type: 'send' | 'receive' | 'stake' | 'vote' | 'contract-interaction';
};
