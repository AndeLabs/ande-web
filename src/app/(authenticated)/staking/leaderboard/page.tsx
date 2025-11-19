'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Trophy,
  Medal,
  Award,
  Crown,
  TrendingUp,
  Users,
  Coins,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

// Mock leaderboard data - in production this would come from an API/contract
const leaderboardData = [
  { rank: 1, address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e', staked: '2,450,000', rewards: '125,000', pool: 'Heavy' },
  { rank: 2, address: '0x8Ba1f109551bD432803012645Ac136ddd64DBA72', staked: '1,890,000', rewards: '94,500', pool: 'Heavy' },
  { rank: 3, address: '0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2', staked: '1,650,000', rewards: '82,500', pool: 'Heavy' },
  { rank: 4, address: '0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db', staked: '1,200,000', rewards: '60,000', pool: 'Medium' },
  { rank: 5, address: '0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB', staked: '980,000', rewards: '49,000', pool: 'Heavy' },
  { rank: 6, address: '0x617F2E2fD72FD9D5503197092aC168c91465E7f2', staked: '750,000', rewards: '37,500', pool: 'Medium' },
  { rank: 7, address: '0x17F6AD8Ef982297579C203069C1DbfFE4348c372', staked: '620,000', rewards: '31,000', pool: 'Medium' },
  { rank: 8, address: '0x5c6B0f7Bf3E7ce046039Bd8FABdfD3f9F5021678', staked: '480,000', rewards: '24,000', pool: 'Light' },
  { rank: 9, address: '0x03C6FcED478cBbC9a4FAB34eF9f40767739D1Ff7', staked: '350,000', rewards: '17,500', pool: 'Light' },
  { rank: 10, address: '0x1aE0EA34a72D944a8C7603FfB3eC30a6669E454C', staked: '275,000', rewards: '13,750', pool: 'Light' },
];

function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function getRankIcon(rank: number) {
  switch (rank) {
    case 1:
      return <Crown className="h-5 w-5 text-yellow-500" />;
    case 2:
      return <Medal className="h-5 w-5 text-gray-400" />;
    case 3:
      return <Medal className="h-5 w-5 text-amber-600" />;
    default:
      return <Award className="h-5 w-5 text-muted-foreground" />;
  }
}

function getRankBg(rank: number): string {
  switch (rank) {
    case 1:
      return 'bg-yellow-500/10 border-yellow-500/20';
    case 2:
      return 'bg-gray-500/10 border-gray-500/20';
    case 3:
      return 'bg-amber-500/10 border-amber-500/20';
    default:
      return 'bg-muted';
  }
}

export default function StakingLeaderboardPage() {
  // Calculate totals from mock data
  const totalStaked = leaderboardData.reduce((acc, item) => {
    return acc + parseInt(item.staked.replace(/,/g, ''));
  }, 0);

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
        <h1 className="text-3xl font-bold mb-2">Staking Leaderboard</h1>
        <p className="text-muted-foreground">
          Top stakers on ANDE Network
        </p>
      </section>

      {/* Stats */}
      <section className="mb-8">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6 text-center">
              <Trophy className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
              <p className="text-2xl font-bold">{leaderboardData.length}</p>
              <p className="text-sm text-muted-foreground">Top Stakers</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Coins className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{(totalStaked / 1000000).toFixed(1)}M</p>
              <p className="text-sm text-muted-foreground">Total Staked (Top 10)</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <TrendingUp className="h-6 w-6 mx-auto mb-2 text-green-500" />
              <p className="text-2xl font-bold">25%</p>
              <p className="text-sm text-muted-foreground">Max APY</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Leaderboard */}
      <section className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Top Stakers
            </CardTitle>
            <CardDescription>
              Rankings based on total ANDE staked
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leaderboardData.map((staker) => (
                <div
                  key={staker.address}
                  className={`flex items-center gap-4 p-4 rounded-lg border ${getRankBg(staker.rank)}`}
                >
                  {/* Rank */}
                  <div className="flex items-center justify-center w-10 h-10">
                    {staker.rank <= 3 ? (
                      getRankIcon(staker.rank)
                    ) : (
                      <span className="text-lg font-bold text-muted-foreground">
                        {staker.rank}
                      </span>
                    )}
                  </div>

                  {/* Address */}
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-sm">
                      {formatAddress(staker.address)}
                    </p>
                    <Badge variant="secondary" className="text-xs mt-1">
                      {staker.pool} Pool
                    </Badge>
                  </div>

                  {/* Staked Amount */}
                  <div className="text-right">
                    <p className="font-bold">{staker.staked} ANDE</p>
                    <p className="text-xs text-muted-foreground">
                      +{staker.rewards} rewards
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* CTA */}
      <section>
        <Card className="bg-gradient-to-br from-primary/5 to-brand-orange/5">
          <CardContent className="py-8 text-center">
            <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h2 className="text-xl font-bold mb-2">Join the Leaderboard</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Stake your ANDE tokens to earn rewards and climb the ranks.
              Higher stakes in longer lockup pools earn more rewards!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild>
                <Link href="/staking/heavy">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Stake in Heavy Pool (25% APY)
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/staking">
                  View All Pools
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
