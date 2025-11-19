'use client';

import { useAccount } from 'wagmi';
import { useBalance, useStaking, useAddressTransactions } from 'packages/blockchain/hooks';
import { formatAmount } from 'packages/blockchain/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Wallet,
  Coins,
  Gift,
  PieChart,
  ArrowUpRight,
  ArrowDownLeft,
  ExternalLink,
  TrendingUp,
  Leaf,
  Gem,
  Flame,
} from 'lucide-react';
import Link from 'next/link';

function truncateAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function formatTimestamp(timestamp: string) {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;

  return date.toLocaleDateString();
}

export default function PortfolioPage() {
  const { address, isConnected } = useAccount();
  const { formattedBalance, isLoading: balanceLoading } = useBalance();
  const { stakingData, earnedRewards, isLoading: stakingLoading } = useStaking();
  const { data: txData, isLoading: txLoading } = useAddressTransactions(address);

  if (!isConnected) {
    return (
      <div className="container mx-auto py-12 px-4">
        <Card>
          <CardHeader>
            <CardTitle>Portfolio</CardTitle>
            <CardDescription>
              Connect your wallet to view your portfolio.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Please connect your wallet to see your ANDE holdings and staking positions.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate totals
  const walletBalance = parseFloat(formattedBalance || '0');
  const stakedLight = stakingData.light ? parseFloat(formatAmount(stakingData.light, 18, 4)) : 0;
  const stakedMedium = stakingData.medium ? parseFloat(formatAmount(stakingData.medium, 18, 4)) : 0;
  const stakedHeavy = stakingData.heavy ? parseFloat(formatAmount(stakingData.heavy, 18, 4)) : 0;
  const totalStaked = stakedLight + stakedMedium + stakedHeavy;

  const rewardsLight = earnedRewards.light ? parseFloat(formatAmount(earnedRewards.light, 18, 6)) : 0;
  const rewardsMedium = earnedRewards.medium ? parseFloat(formatAmount(earnedRewards.medium, 18, 6)) : 0;
  const rewardsHeavy = earnedRewards.heavy ? parseFloat(formatAmount(earnedRewards.heavy, 18, 6)) : 0;
  const totalRewards = rewardsLight + rewardsMedium + rewardsHeavy;

  const totalValue = walletBalance + totalStaked + totalRewards;

  const transactions = txData?.items || [];

  const isLoading = balanceLoading || stakingLoading;

  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Portfolio</h1>
        <p className="text-muted-foreground">
          Overview of your ANDE holdings across wallet and staking
        </p>
      </div>

      {/* Total Value */}
      <Card className="bg-gradient-to-br from-primary/10 to-brand-orange/10">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Portfolio Value
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-10 w-48" />
          ) : (
            <div>
              <p className="text-4xl font-bold">{totalValue.toFixed(4)} ANDE</p>
              <p className="text-sm text-muted-foreground mt-1">
                Wallet + Staked + Pending Rewards
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Breakdown Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {balanceLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <p className="text-2xl font-bold">{walletBalance.toFixed(4)} ANDE</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Staked</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {stakingLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <p className="text-2xl font-bold">{totalStaked.toFixed(4)} ANDE</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Rewards</CardTitle>
            <Gift className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            {stakingLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <p className="text-2xl font-bold text-green-500">{totalRewards.toFixed(6)} ANDE</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Staking Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Staking Positions
          </CardTitle>
          <CardDescription>
            Your staking distribution across pools
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {stakingLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : totalStaked === 0 ? (
            <div className="text-center py-6">
              <Coins className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No staking positions</p>
              <p className="text-muted-foreground mb-4">
                Start staking to earn rewards
              </p>
              <Button asChild>
                <Link href="/staking">Go to Staking Hub</Link>
              </Button>
            </div>
          ) : (
            <>
              {/* Light Pool */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Leaf className="h-4 w-4 text-green-500" />
                    <span className="font-medium">Light Pool</span>
                    <Badge variant="secondary" className="text-xs">5% APY</Badge>
                  </div>
                  <span className="font-mono">{stakedLight.toFixed(4)} ANDE</span>
                </div>
                <Progress value={totalStaked > 0 ? (stakedLight / totalStaked) * 100 : 0} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Rewards: {rewardsLight.toFixed(6)} ANDE</span>
                  <span>{totalStaked > 0 ? ((stakedLight / totalStaked) * 100).toFixed(1) : 0}%</span>
                </div>
              </div>

              {/* Medium Pool */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Gem className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">Medium Pool</span>
                    <Badge variant="secondary" className="text-xs">12% APY</Badge>
                  </div>
                  <span className="font-mono">{stakedMedium.toFixed(4)} ANDE</span>
                </div>
                <Progress value={totalStaked > 0 ? (stakedMedium / totalStaked) * 100 : 0} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Rewards: {rewardsMedium.toFixed(6)} ANDE</span>
                  <span>{totalStaked > 0 ? ((stakedMedium / totalStaked) * 100).toFixed(1) : 0}%</span>
                </div>
              </div>

              {/* Heavy Pool */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Flame className="h-4 w-4 text-red-500" />
                    <span className="font-medium">Heavy Pool</span>
                    <Badge variant="secondary" className="text-xs">25% APY</Badge>
                  </div>
                  <span className="font-mono">{stakedHeavy.toFixed(4)} ANDE</span>
                </div>
                <Progress value={totalStaked > 0 ? (stakedHeavy / totalStaked) * 100 : 0} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Rewards: {rewardsHeavy.toFixed(6)} ANDE</span>
                  <span>{totalStaked > 0 ? ((stakedHeavy / totalStaked) * 100).toFixed(1) : 0}%</span>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recent Transactions
            </CardTitle>
            <CardDescription>Your latest activity on ANDE Network</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/transactions">View All</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {txLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.slice(0, 5).map((tx) => {
                const isOutgoing = tx.from.hash.toLowerCase() === address?.toLowerCase();
                return (
                  <div key={tx.hash} className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${isOutgoing ? 'bg-red-500/10' : 'bg-green-500/10'}`}>
                      {isOutgoing ? (
                        <ArrowUpRight className="h-4 w-4 text-red-500" />
                      ) : (
                        <ArrowDownLeft className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        {isOutgoing ? 'Sent' : 'Received'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatTimestamp(tx.timestamp)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-mono text-sm ${isOutgoing ? 'text-red-500' : 'text-green-500'}`}>
                        {isOutgoing ? '-' : '+'}{formatAmount(BigInt(tx.value), 18, 4)} ANDE
                      </p>
                      <a
                        href={`https://explorer.ande.network/tx/${tx.hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-muted-foreground hover:text-primary inline-flex items-center gap-1"
                      >
                        {truncateAddress(tx.hash)}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
