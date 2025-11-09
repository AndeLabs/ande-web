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
  ArrowRightLeft,
  Coins,
  Plus,
  Send,
  Vote,
} from 'lucide-react';
import Link from 'next/link';
import { useBalance, useStaking, useGovernance, useTransactions } from 'packages/blockchain/hooks';
import { formatAmount } from 'packages/blockchain/utils';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Badge } from '@/components/ui/badge';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

function PortfolioOverview() {
  const { formattedBalance, isLoading } = useBalance();
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Overview</CardTitle>
          <CardDescription>Your total balance and recent performance.</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Overview</CardTitle>
        <CardDescription>Your total balance and recent performance.</CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          <p className="text-3xl font-bold">{formattedBalance ? formatAmount(BigInt(formattedBalance), 18, 4) : '0.0000'} ANDE</p>
          <p className="text-sm text-muted-foreground">~ $0.00 USD</p>
        </div>
      </CardContent>
    </Card>
  );
}

function StakingSummary() {
    const { stakingData, isLoading } = useStaking();
    const totalStaked = Object.values(stakingData || {}).reduce((acc, val) => (acc || BigInt(0)) + (val || BigInt(0)), BigInt(0));

    if (isLoading) {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Staking Summary</CardTitle>
            <CardDescription>Your current staking positions and rewards.</CardDescription>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Staking Summary</CardTitle>
                <CardDescription>Your current staking positions and rewards.</CardDescription>
            </CardHeader>
            <CardContent>
                <div>
                    <p className="text-3xl font-bold">{formatAmount(totalStaked || BigInt(0), 18, 4)} ANDE</p>
                    <p className="text-sm text-muted-foreground">Across all pools</p>
                </div>
            </CardContent>
        </Card>
    );
}

function GovernanceSummary() {
    const { proposals, votingPower } = useGovernance();
    const isLoading = proposals.isLoading || votingPower.isLoading;

    if (isLoading) {
        return (
          <Card>
            <CardHeader>
              <CardTitle>Governance</CardTitle>
              <CardDescription>Active proposals and your voting power.</CardDescription>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
               <Skeleton className="h-4 w-1/3 mt-2" />
            </CardContent>
          </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Governance</CardTitle>
                <CardDescription>Active proposals and your voting power.</CardDescription>
            </CardHeader>
            <CardContent>
                <div>
                    <p className="text-3xl font-bold">{votingPower.data ? formatAmount(BigInt(votingPower.data), 18, 2) : '0'} ANDE</p>
                    <p className="text-sm text-muted-foreground">Voting Power</p>
                    <p className="mt-2 text-sm">{proposals.data?.length || 0} Active Proposals</p>
                </div>
            </CardContent>
        </Card>
    );
}


function RecentActivity() {
    const { transactions, loading } = useTransactions();

    if (loading) {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your last transactions on the network.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your last transactions on the network.</CardDescription>
            </CardHeader>
            <CardContent>
                
                    <ul className="space-y-4">
                        {transactions.slice(0, 5).map(tx => (
                            <li key={tx.hash} className="flex items-center justify-between text-sm">
                                <div>
                                    <p className="font-medium">{tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}</p>
                                    <p className="text-muted-foreground">{formatAmount(tx.value, 18, 4)} ANDE</p>
                                </div>
                                <Badge variant={tx.status === 'success' ? 'default' : 'destructive'}>{tx.status}</Badge>
                            </li>
                        ))}
                    </ul>
                
            </CardContent>
        </Card>
    )
}

function DashboardCardSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-8 w-1/2 mb-2" />
                <Skeleton className="h-4 w-1/3" />
            </CardContent>
        </Card>
    )
}

export default function DashboardPage() {
  return (
    <div className="grid gap-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<DashboardCardSkeleton />}>
            <PortfolioOverview />
        </Suspense>
        <Suspense fallback={<DashboardCardSkeleton />}>
            <StakingSummary />
        </Suspense>
        <Suspense fallback={<DashboardCardSkeleton />}>
            <GovernanceSummary />
        </Suspense>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
             <CardDescription>Quick access to common actions.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button asChild variant="outline"><Link href="/transactions/send"><Send className="mr-2 h-4 w-4" /> Send ANDE</Link></Button>
            <Button asChild variant="outline"><Link href="/staking"><Coins className="mr-2 h-4 w-4" /> Stake ANDE</Link></Button>
            <Button asChild variant="outline"><Link href="/governance/proposals"><Vote className="mr-2 h-4 w-4" /> Vote on Proposal</Link></Button>
            <Button asChild variant="outline"><Link href="/defi/liquidity"><Plus className="mr-2 h-4 w-4" /> Add Liquidity</Link></Button>
          </CardContent>
        </Card>
      </div>
      <Suspense fallback={<Card><CardHeader><Skeleton className="h-6 w-1/4" /></CardHeader><CardContent><Skeleton className="h-24 w-full" /></CardContent></Card>}>
        <RecentActivity />
      </Suspense>
    </div>
  );
}
