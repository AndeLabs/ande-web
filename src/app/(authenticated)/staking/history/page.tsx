'use client';

import { useAccount } from 'wagmi';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  History,
  ArrowUpRight,
  ArrowDownRight,
  Gift,
  ExternalLink,
  Clock,
  Wallet,
} from 'lucide-react';
import { useAddressTransactions } from '@workspace/blockchain';
import { formatAmount } from 'packages/blockchain/utils';
import Link from 'next/link';

// Staking contract address
const STAKING_CONTRACT = '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853'.toLowerCase();

type StakingAction = 'stake' | 'unstake' | 'claim' | 'unknown';

function getStakingAction(tx: any, userAddress: string): StakingAction {
  const to = tx.to?.hash?.toLowerCase();
  const from = tx.from?.hash?.toLowerCase();
  const user = userAddress.toLowerCase();

  if (to === STAKING_CONTRACT && from === user) {
    // Check method signature if available
    const input = tx.raw_input?.toLowerCase() || '';
    if (input.startsWith('0xa694fc3a')) return 'stake'; // stake(uint256)
    if (input.startsWith('0x2e1a7d4d')) return 'unstake'; // withdraw(uint256)
    if (input.startsWith('0x4e71d92d')) return 'claim'; // claim()
    if (input.startsWith('0x3ccfd60b')) return 'claim'; // withdraw() - claim rewards
    return 'stake'; // Default to stake for outgoing to staking contract
  }

  if (from === STAKING_CONTRACT && to === user) {
    return 'unstake'; // Receiving from staking contract
  }

  return 'unknown';
}

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString();
}

export default function StakingHistoryPage() {
  const { address, isConnected } = useAccount();
  const { data: txData, isLoading, error } = useAddressTransactions(address || '');

  if (!isConnected || !address) {
    return (
      <div className="container mx-auto py-12 px-4 max-w-4xl">
        <Card>
          <CardContent className="py-12 text-center">
            <Wallet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Connect Your Wallet</h2>
            <p className="text-muted-foreground">
              Connect your wallet to view your staking history.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Filter transactions related to staking
  const stakingTransactions = txData?.items?.filter((tx: any) => {
    const to = tx.to?.hash?.toLowerCase();
    const from = tx.from?.hash?.toLowerCase();
    return to === STAKING_CONTRACT || from === STAKING_CONTRACT;
  }) || [];

  // Calculate stats
  const stats = {
    totalStakes: stakingTransactions.filter((tx: any) => getStakingAction(tx, address) === 'stake').length,
    totalUnstakes: stakingTransactions.filter((tx: any) => getStakingAction(tx, address) === 'unstake').length,
    totalClaims: stakingTransactions.filter((tx: any) => getStakingAction(tx, address) === 'claim').length,
  };

  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      {/* Header */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/staking">
              ← Back to Staking
            </Link>
          </Button>
        </div>
        <h1 className="text-3xl font-bold mb-2">Staking History</h1>
        <p className="text-muted-foreground">
          View all your staking transactions and activity
        </p>
      </section>

      {/* Stats */}
      <section className="mb-8">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6 text-center">
              <ArrowUpRight className="h-6 w-6 mx-auto mb-2 text-green-500" />
              <p className="text-2xl font-bold">{stats.totalStakes}</p>
              <p className="text-sm text-muted-foreground">Stakes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <ArrowDownRight className="h-6 w-6 mx-auto mb-2 text-orange-500" />
              <p className="text-2xl font-bold">{stats.totalUnstakes}</p>
              <p className="text-sm text-muted-foreground">Unstakes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Gift className="h-6 w-6 mx-auto mb-2 text-purple-500" />
              <p className="text-2xl font-bold">{stats.totalClaims}</p>
              <p className="text-sm text-muted-foreground">Claims</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Transaction List */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Transaction History
            </CardTitle>
            <CardDescription>
              All staking-related transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-8 text-muted-foreground">
                Failed to load staking history. Please try again later.
              </div>
            ) : stakingTransactions.length === 0 ? (
              <div className="text-center py-8">
                <History className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">No staking transactions yet</p>
                <Button asChild>
                  <Link href="/staking">Start Staking</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {stakingTransactions.map((tx: any) => {
                  const action = getStakingAction(tx, address);
                  const isStake = action === 'stake';
                  const isClaim = action === 'claim';

                  return (
                    <div
                      key={tx.hash}
                      className="flex items-center gap-4 p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isStake ? 'bg-green-500/20' :
                        isClaim ? 'bg-purple-500/20' :
                        'bg-orange-500/20'
                      }`}>
                        {isStake ? (
                          <ArrowUpRight className="h-5 w-5 text-green-500" />
                        ) : isClaim ? (
                          <Gift className="h-5 w-5 text-purple-500" />
                        ) : (
                          <ArrowDownRight className="h-5 w-5 text-orange-500" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium capitalize">{action}</span>
                          <Badge variant="secondary" className="text-xs">
                            {tx.status === 'ok' ? 'Success' : 'Failed'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground font-mono truncate">
                          {tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className={`font-medium ${
                          isStake ? 'text-green-500' :
                          isClaim ? 'text-purple-500' :
                          'text-orange-500'
                        }`}>
                          {isStake ? '+' : '-'}{tx.value ? formatAmount(BigInt(tx.value)) : '0'} ANDE
                        </p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {formatTimestamp(tx.timestamp)}
                        </div>
                      </div>

                      <Button variant="ghost" size="icon" asChild>
                        <a
                          href={`https://explorer.ande.network/tx/${tx.hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
