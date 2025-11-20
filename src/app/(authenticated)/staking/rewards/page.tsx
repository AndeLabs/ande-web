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
import { Progress } from '@/components/ui/progress';
import {
  Gift,
  TrendingUp,
  Coins,
  Clock,
  Zap,
  ArrowRight,
  Wallet,
  PieChart,
} from 'lucide-react';
import { useStaking } from '@workspace/blockchain';
import { formatAmount } from 'packages/blockchain/utils';
import { formatUnits } from 'viem';
import Link from 'next/link';

export default function StakingRewardsPage() {
  const { address, isConnected } = useAccount();
  const { stakingData, earnedRewards, isLoading } = useStaking();

  if (!isConnected || !address) {
    return (
      <div className="container mx-auto py-12 px-4 max-w-4xl">
        <Card>
          <CardContent className="py-12 text-center">
            <Wallet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Connect Your Wallet</h2>
            <p className="text-muted-foreground">
              Connect your wallet to view your staking rewards.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate totals
  const totalStaked = stakingData
    ? (stakingData.light?.staked || 0n) +
      (stakingData.medium?.staked || 0n) +
      (stakingData.heavy?.staked || 0n)
    : 0n;

  const totalRewards =
    (earnedRewards.light || 0n) +
    (earnedRewards.medium || 0n) +
    (earnedRewards.heavy || 0n);

  // Calculate percentages for distribution
  const lightRewardsNum = Number(formatUnits(earnedRewards.light || 0n, 18));
  const mediumRewardsNum = Number(formatUnits(earnedRewards.medium || 0n, 18));
  const heavyRewardsNum = Number(formatUnits(earnedRewards.heavy || 0n, 18));
  const totalRewardsNum = lightRewardsNum + mediumRewardsNum + heavyRewardsNum;

  const lightPercent = totalRewardsNum > 0 ? (lightRewardsNum / totalRewardsNum) * 100 : 0;
  const mediumPercent = totalRewardsNum > 0 ? (mediumRewardsNum / totalRewardsNum) * 100 : 0;
  const heavyPercent = totalRewardsNum > 0 ? (heavyRewardsNum / totalRewardsNum) * 100 : 0;

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
        <h1 className="text-3xl font-bold mb-2">Staking Rewards</h1>
        <p className="text-muted-foreground">
          View and claim your earned staking rewards
        </p>
      </section>

      {/* Total Rewards */}
      <section className="mb-8">
        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10">
          <CardContent className="py-8">
            <div className="text-center">
              <Gift className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <p className="text-sm text-muted-foreground mb-2">Total Pending Rewards</p>
              {isLoading ? (
                <Skeleton className="h-12 w-48 mx-auto" />
              ) : (
                <p className="text-4xl font-bold text-green-500">
                  {formatAmount(totalRewards)} ANDE
                </p>
              )}
              <p className="text-sm text-muted-foreground mt-2">
                From {formatAmount(totalStaked)} ANDE staked
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Stats */}
      <section className="mb-8">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6 text-center">
              <Coins className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-sm text-muted-foreground">Total Staked</p>
              {isLoading ? (
                <Skeleton className="h-6 w-24 mx-auto mt-1" />
              ) : (
                <p className="text-xl font-bold">{formatAmount(totalStaked)} ANDE</p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <TrendingUp className="h-6 w-6 mx-auto mb-2 text-green-500" />
              <p className="text-sm text-muted-foreground">Avg. APY</p>
              <p className="text-xl font-bold">~14%</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Clock className="h-6 w-6 mx-auto mb-2 text-orange-500" />
              <p className="text-sm text-muted-foreground">Active Pools</p>
              {isLoading ? (
                <Skeleton className="h-6 w-8 mx-auto mt-1" />
              ) : (
                <p className="text-xl font-bold">
                  {[
                    stakingData?.light?.staked && stakingData.light.staked > 0n,
                    stakingData?.medium?.staked && stakingData.medium.staked > 0n,
                    stakingData?.heavy?.staked && stakingData.heavy.staked > 0n,
                  ].filter(Boolean).length}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Rewards by Pool */}
      <section className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Rewards by Pool
            </CardTitle>
            <CardDescription>
              Breakdown of your pending rewards
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Light Pool */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Light Pool</span>
                  <Badge variant="secondary" className="text-xs">5% APY</Badge>
                </div>
                {isLoading ? (
                  <Skeleton className="h-4 w-24" />
                ) : (
                  <span className="font-mono">{formatAmount(earnedRewards.light || 0n)} ANDE</span>
                )}
              </div>
              <Progress value={lightPercent} className="h-2 bg-muted" />
            </div>

            {/* Medium Pool */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Medium Pool</span>
                  <Badge variant="secondary" className="text-xs">12% APY</Badge>
                </div>
                {isLoading ? (
                  <Skeleton className="h-4 w-24" />
                ) : (
                  <span className="font-mono">{formatAmount(earnedRewards.medium || 0n)} ANDE</span>
                )}
              </div>
              <Progress value={mediumPercent} className="h-2 bg-muted" />
            </div>

            {/* Heavy Pool */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Heavy Pool</span>
                  <Badge variant="secondary" className="text-xs">25% APY</Badge>
                </div>
                {isLoading ? (
                  <Skeleton className="h-4 w-24" />
                ) : (
                  <span className="font-mono">{formatAmount(earnedRewards.heavy || 0n)} ANDE</span>
                )}
              </div>
              <Progress value={heavyPercent} className="h-2 bg-muted" />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* MEV Rewards Info */}
      <section className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              MEV Redistribution
            </CardTitle>
            <CardDescription>
              Additional rewards from MEV extraction
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Your Share</p>
                <p className="text-2xl font-bold text-yellow-500">80%</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Of MEV goes to stakers like you
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Distribution</p>
                <p className="text-sm">
                  MEV rewards are distributed proportionally based on your stake
                  amount and pool tier. Higher tiers receive a larger share.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Actions */}
      <section>
        <Card className="bg-gradient-to-br from-primary/5 to-brand-orange/5">
          <CardContent className="py-8">
            <div className="text-center">
              <h2 className="text-xl font-bold mb-4">Claim Your Rewards</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Visit each pool page to claim your pending rewards.
                Claimed rewards are automatically added to your wallet.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {stakingData?.light?.staked && stakingData.light.staked > 0n && (
                  <Button variant="outline" asChild>
                    <Link href="/staking/light">
                      Light Pool
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                )}
                {stakingData?.medium?.staked && stakingData.medium.staked > 0n && (
                  <Button variant="outline" asChild>
                    <Link href="/staking/medium">
                      Medium Pool
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                )}
                {stakingData?.heavy?.staked && stakingData.heavy.staked > 0n && (
                  <Button variant="outline" asChild>
                    <Link href="/staking/heavy">
                      Heavy Pool
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                )}
                {totalStaked === 0n && (
                  <Button asChild>
                    <Link href="/staking">
                      Start Staking
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
