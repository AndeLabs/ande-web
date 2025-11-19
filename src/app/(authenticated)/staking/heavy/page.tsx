'use client';

import { useState } from 'react';
import { useStaking } from 'packages/blockchain/hooks/useStaking';
import { useBalance } from 'packages/blockchain/hooks/useBalance';
import { formatAmount } from 'packages/blockchain/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useToast } from '@/hooks/use-toast';
import {
  Flame,
  ArrowDownToLine,
  ArrowUpFromLine,
  Gift,
  Info,
  CheckCircle2,
  ExternalLink,
  Lock,
  AlertTriangle,
} from 'lucide-react';
import Link from 'next/link';

const POOL_INFO = {
  name: 'Heavy Pool',
  apy: '25%',
  lockup: '6 months',
  minStake: '500',
  description: 'Maximum rewards for long-term believers. Highest APY with extended lockup.',
};

export default function StakingHeavyPage() {
  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');
  const { toast } = useToast();

  const {
    stakingData,
    earnedRewards,
    stake,
    unstake,
    claimRewards,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
  } = useStaking();

  const { formattedBalance } = useBalance();

  const userStaked = stakingData.heavy ? formatAmount(stakingData.heavy, 18, 4) : '0';
  const userRewards = earnedRewards.heavy ? formatAmount(earnedRewards.heavy, 18, 6) : '0';

  const handleStake = async () => {
    if (!stakeAmount || parseFloat(stakeAmount) < parseFloat(POOL_INFO.minStake)) {
      toast({
        variant: 'destructive',
        title: 'Invalid Amount',
        description: `Minimum stake is ${POOL_INFO.minStake} ANDE`,
      });
      return;
    }

    try {
      await stake({ pool: 'heavy', amount: stakeAmount });
      toast({
        title: 'Transaction Submitted',
        description: 'Your stake transaction has been submitted.',
      });
      setStakeAmount('');
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Transaction Failed',
        description: err instanceof Error ? err.message : 'Failed to stake',
      });
    }
  };

  const handleUnstake = async () => {
    if (!unstakeAmount || parseFloat(unstakeAmount) <= 0) {
      toast({
        variant: 'destructive',
        title: 'Invalid Amount',
        description: 'Please enter a valid amount to unstake',
      });
      return;
    }

    try {
      await unstake({ pool: 'heavy', amount: unstakeAmount });
      toast({
        title: 'Transaction Submitted',
        description: 'Your unstake transaction has been submitted.',
      });
      setUnstakeAmount('');
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Transaction Failed',
        description: err instanceof Error ? err.message : 'Failed to unstake',
      });
    }
  };

  const handleClaim = async () => {
    try {
      await claimRewards({ pool: 'heavy' });
      toast({
        title: 'Transaction Submitted',
        description: 'Your claim transaction has been submitted.',
      });
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Transaction Failed',
        description: err instanceof Error ? err.message : 'Failed to claim rewards',
      });
    }
  };

  const setMaxStake = () => {
    setStakeAmount(formattedBalance || '0');
  };

  const setMaxUnstake = () => {
    setUnstakeAmount(userStaked);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link href="/staking" className="text-sm text-muted-foreground hover:text-primary mb-4 inline-block">
          ← Back to Staking Hub
        </Link>
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-red-500/10">
            <Flame className="h-8 w-8 text-red-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{POOL_INFO.name}</h1>
            <p className="text-muted-foreground">{POOL_INFO.description}</p>
          </div>
        </div>
      </div>

      {/* Lockup Warning */}
      <Alert className="mb-6 border-red-500/50 bg-red-500/10">
        <AlertTriangle className="h-4 w-4 text-red-500" />
        <AlertDescription className="text-red-500">
          <strong>Important:</strong> This pool has a {POOL_INFO.lockup} lockup period. Your tokens will be locked and cannot be unstaked until the lockup period expires.
        </AlertDescription>
      </Alert>

      {/* Transaction Status */}
      {(isPending || isConfirming || isConfirmed) && (
        <Alert className="mb-6">
          <AlertDescription className="flex items-center gap-2">
            {isPending && (
              <>
                <LoadingSpinner className="h-4 w-4" />
                Waiting for wallet confirmation...
              </>
            )}
            {isConfirming && (
              <>
                <LoadingSpinner className="h-4 w-4" />
                Transaction confirming...
              </>
            )}
            {isConfirmed && (
              <>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                Transaction confirmed!
                {hash && (
                  <a
                    href={`https://explorer.ande.network/tx/${hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-primary hover:underline inline-flex items-center gap-1"
                  >
                    View on Explorer <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </>
            )}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Your Stake
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{userStaked} ANDE</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Earned Rewards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-500">{userRewards} ANDE</p>
          </CardContent>
        </Card>

        <Card className="border-red-500/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              APY
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-500">{POOL_INFO.apy}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Action Card */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Manage Your Stake</CardTitle>
          <CardDescription>
            Stake, unstake, or claim your rewards from the Heavy Pool.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="stake" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="stake">
                <ArrowDownToLine className="h-4 w-4 mr-2" />
                Stake
              </TabsTrigger>
              <TabsTrigger value="unstake">
                <ArrowUpFromLine className="h-4 w-4 mr-2" />
                Unstake
              </TabsTrigger>
              <TabsTrigger value="claim">
                <Gift className="h-4 w-4 mr-2" />
                Claim
              </TabsTrigger>
            </TabsList>

            <TabsContent value="stake" className="space-y-4 mt-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="stake-amount">Amount to Stake</Label>
                  <span className="text-sm text-muted-foreground">
                    Balance: {formattedBalance || '0'} ANDE
                  </span>
                </div>
                <div className="flex gap-2">
                  <Input
                    id="stake-amount"
                    type="number"
                    placeholder={`Min ${POOL_INFO.minStake} ANDE`}
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    disabled={isPending || isConfirming}
                  />
                  <Button variant="outline" onClick={setMaxStake} disabled={isPending || isConfirming}>
                    Max
                  </Button>
                </div>
              </div>
              <Button
                className="w-full bg-red-500 hover:bg-red-600"
                onClick={handleStake}
                disabled={isPending || isConfirming || !stakeAmount}
              >
                {isPending || isConfirming ? (
                  <>
                    <LoadingSpinner className="mr-2 h-4 w-4" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Stake ANDE (6 months lock)
                  </>
                )}
              </Button>
            </TabsContent>

            <TabsContent value="unstake" className="space-y-4 mt-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="unstake-amount">Amount to Unstake</Label>
                  <span className="text-sm text-muted-foreground">
                    Staked: {userStaked} ANDE
                  </span>
                </div>
                <div className="flex gap-2">
                  <Input
                    id="unstake-amount"
                    type="number"
                    placeholder="0.0"
                    value={unstakeAmount}
                    onChange={(e) => setUnstakeAmount(e.target.value)}
                    disabled={isPending || isConfirming}
                  />
                  <Button variant="outline" onClick={setMaxUnstake} disabled={isPending || isConfirming}>
                    Max
                  </Button>
                </div>
              </div>
              <Button
                className="w-full"
                onClick={handleUnstake}
                disabled={isPending || isConfirming || !unstakeAmount}
              >
                {isPending || isConfirming ? (
                  <>
                    <LoadingSpinner className="mr-2 h-4 w-4" />
                    Processing...
                  </>
                ) : (
                  'Unstake ANDE'
                )}
              </Button>
            </TabsContent>

            <TabsContent value="claim" className="space-y-4 mt-4">
              <div className="text-center py-4">
                <Gift className="h-12 w-12 mx-auto text-green-500 mb-4" />
                <p className="text-2xl font-bold">{userRewards} ANDE</p>
                <p className="text-muted-foreground">Available to claim</p>
              </div>
              <Button
                className="w-full"
                onClick={handleClaim}
                disabled={isPending || isConfirming || parseFloat(userRewards) <= 0}
              >
                {isPending || isConfirming ? (
                  <>
                    <LoadingSpinner className="mr-2 h-4 w-4" />
                    Processing...
                  </>
                ) : (
                  'Claim Rewards'
                )}
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Pool Info */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Pool Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span className="text-muted-foreground">APY</span>
            <span className="font-medium text-red-500">{POOL_INFO.apy}</span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span className="text-muted-foreground">Lockup Period</span>
            <span className="font-medium text-red-500">{POOL_INFO.lockup}</span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span className="text-muted-foreground">Minimum Stake</span>
            <span className="font-medium">{POOL_INFO.minStake} ANDE</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
