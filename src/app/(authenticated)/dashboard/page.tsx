'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Coins,
  Plus,
  Send,
  Vote,
  Wallet,
  TrendingUp,
  Activity,
  Clock,
} from 'lucide-react';
import Link from 'next/link';
import { useBalance, useStaking, useGovernance, useAddressTransactions } from 'packages/blockchain/hooks';
import { formatAmount } from 'packages/blockchain/utils';
import { Badge } from '@/components/ui/badge';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { SendAndeDialog } from '@/components/send-ande-dialog';

function ConnectWalletPrompt() {
  return (
    <Card className="col-span-full">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Wallet className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
        <p className="text-muted-foreground text-center mb-6 max-w-md">
          Connect your wallet to view your portfolio, staking positions, governance power, and recent activity.
        </p>
        <ConnectButton />
      </CardContent>
    </Card>
  );
}

function PortfolioOverview() {
  const { formattedBalance, isLoading, balance } = useBalance();

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-medium">Balance</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-3/4 mb-1" />
          <Skeleton className="h-4 w-1/2" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Wallet className="h-4 w-4 text-primary" />
          <CardTitle className="text-sm font-medium">Balance</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">
          {balance?.value ? formatAmount(balance.value) : '0'} ANDE
        </p>
        <p className="text-xs text-muted-foreground">Available balance</p>
      </CardContent>
    </Card>
  );
}

function StakingSummary() {
  const { stakingData, isLoading } = useStaking();
  const totalStaked = Object.values(stakingData).reduce(
    (acc: bigint, val) => acc + (val || BigInt(0)),
    BigInt(0)
  );

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Coins className="h-4 w-4 text-brand-orange" />
            <CardTitle className="text-sm font-medium">Staked</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-3/4 mb-1" />
          <Skeleton className="h-4 w-1/2" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Coins className="h-4 w-4 text-brand-orange" />
          <CardTitle className="text-sm font-medium">Staked</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">
          {formatAmount(totalStaked)} ANDE
        </p>
        <p className="text-xs text-muted-foreground">Across all pools</p>
      </CardContent>
    </Card>
  );
}

function GovernanceSummary() {
  const { proposals, votingPower, isLoading } = useGovernance();

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Vote className="h-4 w-4 text-brand-lavender" />
            <CardTitle className="text-sm font-medium">Voting Power</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-3/4 mb-1" />
          <Skeleton className="h-4 w-1/2" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Vote className="h-4 w-4 text-brand-lavender" />
          <CardTitle className="text-sm font-medium">Voting Power</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">
          {votingPower.data ? formatAmount(BigInt(votingPower.data)) : '0'} ANDE
        </p>
        <p className="text-xs text-muted-foreground">
          {proposals.data?.length || 0} active proposals
        </p>
      </CardContent>
    </Card>
  );
}

function NetworkStats() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-green-500" />
          <CardTitle className="text-sm font-medium">APY</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">Up to 25%</p>
        <p className="text-xs text-muted-foreground">Heavy pool rewards</p>
      </CardContent>
    </Card>
  );
}

function RecentActivity() {
  const { address } = useAccount();
  const { data, isLoading, error } = useAddressTransactions(address);

  if (isLoading) {
    return (
      <Card className="col-span-full lg:col-span-2">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <CardTitle>Recent Activity</CardTitle>
          </div>
          <CardDescription>Your latest transactions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </CardContent>
      </Card>
    );
  }

  const transactions = data?.items || [];

  if (transactions.length === 0) {
    return (
      <Card className="col-span-full lg:col-span-2">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <CardTitle>Recent Activity</CardTitle>
          </div>
          <CardDescription>Your latest transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Clock className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No recent transactions</p>
            <p className="text-xs text-muted-foreground mt-1">
              Your activity will appear here
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4" />
          <CardTitle>Recent Activity</CardTitle>
        </div>
        <CardDescription>Your latest transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {transactions.slice(0, 5).map((tx) => {
            const isReceive = tx.to?.hash?.toLowerCase() === address?.toLowerCase();
            const txType = isReceive ? 'Receive' : 'Send';

            return (
              <li
                key={tx.hash}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <div>
                  <p className="font-medium text-sm">{txType}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatAmount(BigInt(tx.value))} ANDE
                  </p>
                </div>
                <Badge
                  variant={tx.status === 'ok' ? 'default' : 'destructive'}
                >
                  {tx.status === 'ok' ? 'success' : tx.status}
                </Badge>
              </li>
            );
          })}
        </ul>
        <Button variant="ghost" className="w-full mt-4" asChild>
          <Link href="/transactions">View All Transactions</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function QuickActions() {
  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks at your fingertips</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2">
        <SendAndeDialog buttonVariant="outline" buttonClassName="justify-start w-full">
          <Button variant="outline" className="justify-start w-full">
            <Send className="mr-2 h-4 w-4" /> Send ANDE
          </Button>
        </SendAndeDialog>
        <Button asChild variant="outline" className="justify-start">
          <Link href="/staking">
            <Coins className="mr-2 h-4 w-4" /> Stake ANDE
          </Link>
        </Button>
        <Button asChild variant="outline" className="justify-start">
          <Link href="/governance/proposals">
            <Vote className="mr-2 h-4 w-4" /> Vote on Proposal
          </Link>
        </Button>
        <Button asChild variant="outline" className="justify-start">
          <Link href="/defi">
            <Plus className="mr-2 h-4 w-4" /> Add Liquidity
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function DashboardCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <Skeleton className="h-4 w-20" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-1/2 mb-1" />
        <Skeleton className="h-4 w-1/3" />
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { isConnected, address } = useAccount();

  // Show connect prompt if wallet is not connected
  if (!isConnected) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <ConnectWalletPrompt />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Suspense fallback={<DashboardCardSkeleton />}>
          <PortfolioOverview />
        </Suspense>
        <Suspense fallback={<DashboardCardSkeleton />}>
          <StakingSummary />
        </Suspense>
        <Suspense fallback={<DashboardCardSkeleton />}>
          <GovernanceSummary />
        </Suspense>
        <NetworkStats />
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        <Suspense
          fallback={
            <Card className="col-span-full lg:col-span-2">
              <CardHeader>
                <Skeleton className="h-6 w-1/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
          }
        >
          <RecentActivity />
        </Suspense>
        <QuickActions />
      </div>
    </div>
  );
}
