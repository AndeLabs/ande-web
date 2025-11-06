'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Flame, Gem, Leaf } from 'lucide-react';
import Link from 'next/link';

interface PoolInfo {
  name: string;
  apy: string;
  lockup: string;
  minStake: string;
  description: string;
  poolId: 0 | 1 | 2;
}

interface StakingCardProps {
  pool: PoolInfo;
  userStake: string;
  earnedRewards: string;
}

const poolIcons = {
  0: <Leaf className="h-6 w-6 text-green-500" />,
  1: <Gem className="h-6 w-6 text-blue-500" />,
  2: <Flame className="h-6 w-6 text-red-500" />,
};

export function StakingCard({
  pool,
  userStake,
  earnedRewards,
}: StakingCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            {poolIcons[pool.poolId]}
            {pool.name}
          </CardTitle>
          <div className="text-lg font-bold text-primary">{pool.apy} APY</div>
        </div>
        <CardDescription>{pool.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Lockup Period</span>
          <span>{pool.lockup}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Minimum Stake</span>
          <span>{pool.minStake}</span>
        </div>
        <Separator />
        <div className="space-y-2">
          <div className="flex justify-between font-medium">
            <span className="text-muted-foreground">Your Stake</span>
            <span>{userStake} ANDE</span>
          </div>
          <div className="flex justify-between font-medium">
            <span className="text-muted-foreground">Earned Rewards</span>
            <span className="text-green-500">~{earnedRewards} ANDE</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <Button asChild>
          <Link href={`/staking/${pool.name.toLowerCase().split(' ')[0]}`}>
            Stake / Manage
          </Link>
        </Button>
        <Button variant="outline">Claim</Button>
      </CardFooter>
    </Card>
  );
}
