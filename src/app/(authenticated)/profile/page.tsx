'use client';

import { useAccount, useBalance, useDisconnect } from 'wagmi';
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
  User,
  Wallet,
  Copy,
  ExternalLink,
  LogOut,
  Shield,
  Clock,
  TrendingUp,
  Coins,
  CheckCircle2,
  History,
} from 'lucide-react';
import { useStaking } from '@workspace/blockchain';
import { formatAmount } from 'packages/blockchain/utils';
import { formatUnits } from 'viem';
import { useState } from 'react';
import Link from 'next/link';

function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default function ProfilePage() {
  const { address, isConnected, chain } = useAccount();
  const { data: balance, isLoading: balanceLoading } = useBalance({
    address,
  });
  const { disconnect } = useDisconnect();
  const { stakingData, earnedRewards, isLoading: stakingLoading } = useStaking();
  const [copied, setCopied] = useState(false);

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isConnected || !address) {
    return (
      <div className="container mx-auto py-12 px-4 max-w-4xl">
        <Card>
          <CardContent className="py-12 text-center">
            <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Connect Your Wallet</h2>
            <p className="text-muted-foreground">
              Connect your wallet to view your profile and staking information.
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

  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      {/* Header */}
      <section className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Profile</h1>
        <p className="text-muted-foreground">
          Manage your wallet and view your staking activity
        </p>
      </section>

      {/* Wallet Info */}
      <section className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Wallet
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Address */}
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-mono text-lg">{formatAddress(address)}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={copyAddress}
                  >
                    {copied ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <Button variant="ghost" size="icon" asChild>
                    <a
                      href={`https://explorer.ande.network/address/${address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>

              {/* Network */}
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Network</p>
                  <p className="font-medium">{chain?.name || 'Unknown'}</p>
                </div>
                <Badge variant="secondary">
                  Chain ID: {chain?.id || 'N/A'}
                </Badge>
              </div>

              {/* Balance */}
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Balance</p>
                  {balanceLoading ? (
                    <Skeleton className="h-6 w-32" />
                  ) : (
                    <p className="text-2xl font-bold">
                      {balance ? formatAmount(balance.value) : '0'} ANDE
                    </p>
                  )}
                </div>
              </div>

              {/* Disconnect */}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => disconnect()}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Disconnect Wallet
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Staking Overview */}
      <section className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Staking Overview
            </CardTitle>
            <CardDescription>
              Your staking positions across all pools
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3 mb-6">
              <div className="text-center p-4 bg-muted rounded-lg">
                <Coins className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-sm text-muted-foreground">Total Staked</p>
                {stakingLoading ? (
                  <Skeleton className="h-6 w-24 mx-auto mt-1" />
                ) : (
                  <p className="text-xl font-bold">{formatAmount(totalStaked)} ANDE</p>
                )}
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <TrendingUp className="h-6 w-6 mx-auto mb-2 text-green-500" />
                <p className="text-sm text-muted-foreground">Pending Rewards</p>
                {stakingLoading ? (
                  <Skeleton className="h-6 w-24 mx-auto mt-1" />
                ) : (
                  <p className="text-xl font-bold text-green-500">
                    {formatAmount(totalRewards)} ANDE
                  </p>
                )}
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <Clock className="h-6 w-6 mx-auto mb-2 text-orange-500" />
                <p className="text-sm text-muted-foreground">Active Pools</p>
                {stakingLoading ? (
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
              </div>
            </div>

            {/* Pool Breakdown */}
            {!stakingLoading && (
              <div className="space-y-3">
                {stakingData?.light?.staked && stakingData.light.staked > 0n && (
                  <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span>Light Pool</span>
                      <Badge variant="secondary" className="text-xs">5% APY</Badge>
                    </div>
                    <span className="font-mono">{formatAmount(stakingData.light.staked)} ANDE</span>
                  </div>
                )}
                {stakingData?.medium?.staked && stakingData.medium.staked > 0n && (
                  <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span>Medium Pool</span>
                      <Badge variant="secondary" className="text-xs">12% APY</Badge>
                    </div>
                    <span className="font-mono">{formatAmount(stakingData.medium.staked)} ANDE</span>
                  </div>
                )}
                {stakingData?.heavy?.staked && stakingData.heavy.staked > 0n && (
                  <div className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span>Heavy Pool</span>
                      <Badge variant="secondary" className="text-xs">25% APY</Badge>
                    </div>
                    <span className="font-mono">{formatAmount(stakingData.heavy.staked)} ANDE</span>
                  </div>
                )}
                {totalStaked === 0n && (
                  <p className="text-center text-muted-foreground py-4">
                    No active stakes. Start staking to earn rewards!
                  </p>
                )}
              </div>
            )}

            <div className="mt-6 flex gap-4">
              <Button className="flex-1" asChild>
                <Link href="/staking">
                  <Shield className="mr-2 h-4 w-4" />
                  Stake More
                </Link>
              </Button>
              <Button variant="outline" className="flex-1" asChild>
                <Link href="/staking/history">
                  <History className="mr-2 h-4 w-4" />
                  View History
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Quick Links */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/transactions">
                  <History className="mr-2 h-4 w-4" />
                  Transaction History
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/portfolio">
                  <Coins className="mr-2 h-4 w-4" />
                  Portfolio
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/staking/rewards">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Rewards History
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <a
                  href={`https://explorer.ande.network/address/${address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View on Explorer
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
