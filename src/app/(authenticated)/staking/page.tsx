'use client';

import { useStaking } from 'packages/blockchain/hooks/useStaking';
import { StakingCard } from '@/components/app/staking-card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { formatAmount } from 'packages/blockchain/utils';

const poolInfo = {
  light: {
    name: 'Light Pool',
    apy: '5%',
    lockup: 'None',
    minStake: '10 ANDE',
    description: 'Flexible staking for casual users',
    poolId: 0 as 0,
  },
  medium: {
    name: 'Medium Pool',
    apy: '12%',
    lockup: '3 months',
    minStake: '100 ANDE',
    description: 'Medium commitment, better rewards',
    poolId: 1 as 1,
  },
  heavy: {
    name: 'Heavy Pool',
    apy: '25%',
    lockup: '6 months',
    minStake: '500 ANDE',
    description: 'Maximum rewards for long-term believers',
    poolId: 2 as 2,
  },
};

export default function StakingPage() {
  const { stakingData, earnedRewards, pools, isLoading, isError } = useStaking();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <LoadingSpinner className="h-12 w-12" />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Error Fetching Staking Data</AlertTitle>
        <AlertDescription>
          There was an issue loading the staking information. Please try again
          later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Staking Hub</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Stake your ANDE tokens to earn rewards and secure the network.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <StakingCard
          pool={poolInfo.light}
          userStake={stakingData.light ? formatAmount(stakingData.light) : '0'}
          earnedRewards={earnedRewards.light ? formatAmount(earnedRewards.light) : '0'}
        />
        <StakingCard
          pool={poolInfo.medium}
          userStake={stakingData.medium ? formatAmount(stakingData.medium) : '0'}
          earnedRewards={earnedRewards.medium ? formatAmount(earnedRewards.medium) : '0'}
        />
        <StakingCard
          pool={poolInfo.heavy}
          userStake={stakingData.heavy ? formatAmount(stakingData.heavy) : '0'}
          earnedRewards={earnedRewards.heavy ? formatAmount(earnedRewards.heavy) : '0'}
        />
      </div>
    </div>
  );
}
