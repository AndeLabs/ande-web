'use client';
import { useState, useEffect } from 'react';
import { usePublicClient, useAccount } from 'wagmi';
import { Transaction } from '../types';

type TransactionTypeFilter = 'send' | 'receive' | 'stake' | 'vote' | 'all';

export function useTransactions() {
    const { address } = useAccount();
    const publicClient = usePublicClient();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [page, setPage] = useState(1);
    const [filter, setFilter] = useState<TransactionTypeFilter>('all');

    useEffect(() => {
        const fetchTransactions = async () => {
            if (!publicClient || !address) return;

            setLoading(true);
            setError(null);
            try {
                // This is a placeholder. A real implementation would need an indexer
                // or a more sophisticated way to query and filter transactions.
                // The basic RPC methods do not support filtering by type or pagination
                // in the way this hook requires.
                
                // For demonstration, we'll just fetch recent blocks and look for transactions
                // involving the user's address.
                const blockNumber = await publicClient.getBlockNumber();
                const blocksToScan = 100;
                const txs: Transaction[] = [];

                for (let i = 0; i < blocksToScan; i++) {
                    const block = await publicClient.getBlock({ blockNumber: blockNumber - BigInt(i), includeTransactions: true });
                    for(const tx of block.transactions) {
                        if (tx.from === address || tx.to === address) {
                           const txReceipt = await publicClient.getTransactionReceipt({ hash: tx.hash });
                           txs.push({
                                hash: tx.hash,
                                from: tx.from,
                                to: tx.to,
                                value: tx.value,
                                blockNumber: tx.blockNumber,
                                timestamp: block.timestamp,
                                status: txReceipt.status,
                                type: tx.to === address ? 'receive' : 'send', // Simplified
                           });
                        }
                    }
                }
                setTransactions(txs);
            } catch (e) {
                setError(e as Error);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, [address, publicClient, page, filter]);

    const loadMore = () => setPage(prev => prev + 1);

    return {
        transactions,
        loading,
        error,
        page,
        setFilter,
        loadMore,
    };
}
