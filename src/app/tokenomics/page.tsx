import { Metadata } from 'next';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Coins,
  Users,
  Building,
  Rocket,
  Shield,
  Gift,
  Zap,
  PieChart,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'ANDE Tokenomics | Token Distribution & Economics',
  description: 'Explore ANDE token distribution, staking rewards, MEV redistribution, and the economic model powering ANDE Network.',
};

// ISR - Regenerate this page every 1 hour
export const revalidate = 3600;

const distribution = [
  {
    category: 'Community & Ecosystem',
    percentage: 40,
    tokens: '400,000,000',
    color: 'bg-blue-500',
    description: 'Grants, incentives, airdrops, and ecosystem development',
  },
  {
    category: 'Staking Rewards',
    percentage: 25,
    tokens: '250,000,000',
    color: 'bg-green-500',
    description: 'Distributed to stakers over time based on pool APY',
  },
  {
    category: 'Team & Advisors',
    percentage: 15,
    tokens: '150,000,000',
    color: 'bg-purple-500',
    description: '4-year vesting with 1-year cliff',
  },
  {
    category: 'Treasury',
    percentage: 10,
    tokens: '100,000,000',
    color: 'bg-orange-500',
    description: 'Protocol development and operational expenses',
  },
  {
    category: 'Liquidity',
    percentage: 10,
    tokens: '100,000,000',
    color: 'bg-yellow-500',
    description: 'DEX liquidity and market making',
  },
];

const stakingPools = [
  {
    name: 'Light Pool',
    apy: '5%',
    lockup: 'None',
    minStake: '10 ANDE',
    icon: '🌱',
  },
  {
    name: 'Medium Pool',
    apy: '12%',
    lockup: '3 months',
    minStake: '100 ANDE',
    icon: '💎',
  },
  {
    name: 'Heavy Pool',
    apy: '25%',
    lockup: '6 months',
    minStake: '500 ANDE',
    icon: '🔥',
  },
];

const tokenUtility = [
  {
    icon: Zap,
    title: 'Gas Fees',
    description: 'Pay for transactions and smart contract execution',
  },
  {
    icon: Shield,
    title: 'Staking',
    description: 'Stake to secure the network and earn rewards',
  },
  {
    icon: Users,
    title: 'Governance',
    description: 'Vote on protocol upgrades and parameters',
  },
  {
    icon: Gift,
    title: 'MEV Rewards',
    description: 'Receive 80% of MEV redistribution as a staker',
  },
];

export default function TokenomicsPage() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-6xl">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <Badge className="mb-4" variant="secondary">
          Token Economics
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          ANDE Tokenomics
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          A fair and sustainable token model designed to align incentives
          between users, stakers, and the protocol.
        </p>
      </section>

      {/* Token Overview */}
      <section className="mb-16">
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold">1B</p>
              <p className="text-sm text-muted-foreground">Total Supply</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold">ANDE</p>
              <p className="text-sm text-muted-foreground">Token Symbol</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold">18</p>
              <p className="text-sm text-muted-foreground">Decimals</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold">Dual</p>
              <p className="text-sm text-muted-foreground">Native + ERC-20</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Token Distribution */}
      <section className="mb-16">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Token Distribution
            </CardTitle>
            <CardDescription>
              Total supply: 1,000,000,000 ANDE
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {distribution.map((item) => (
              <div key={item.category} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">{item.category}</span>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold">{item.percentage}%</span>
                    <p className="text-sm text-muted-foreground">{item.tokens}</p>
                  </div>
                </div>
                <Progress value={item.percentage} className={`h-3 ${item.color}`} />
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      {/* Staking Pools */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Staking Pools</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {stakingPools.map((pool) => (
            <Card key={pool.name} className="text-center">
              <CardHeader>
                <div className="text-4xl mb-2">{pool.icon}</div>
                <CardTitle>{pool.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-3xl font-bold text-primary">{pool.apy}</p>
                  <p className="text-sm text-muted-foreground">APY</p>
                </div>
                <div className="pt-4 border-t space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Lockup</span>
                    <span className="font-medium">{pool.lockup}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Minimum</span>
                    <span className="font-medium">{pool.minStake}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Token Utility */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Token Utility</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {tokenUtility.map((item) => (
            <Card key={item.title}>
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* MEV Redistribution */}
      <section className="mb-16">
        <Card className="bg-gradient-to-br from-primary/5 to-brand-orange/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              MEV Redistribution
            </CardTitle>
            <CardDescription>
              Fair value distribution to network participants
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="text-center p-6 bg-background rounded-lg">
                <p className="text-5xl font-bold text-green-500">80%</p>
                <p className="text-lg font-medium mt-2">To Stakers</p>
                <p className="text-sm text-muted-foreground">
                  Distributed proportionally based on stake amount and pool
                </p>
              </div>
              <div className="text-center p-6 bg-background rounded-lg">
                <p className="text-5xl font-bold text-orange-500">20%</p>
                <p className="text-lg font-medium mt-2">To Treasury</p>
                <p className="text-sm text-muted-foreground">
                  Protocol development and ecosystem growth
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Token Duality */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5" />
              Token Duality
            </CardTitle>
            <CardDescription>
              Unique precompile at address 0xFD
            </CardDescription>
          </CardHeader>
          <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
            <p>
              ANDE features a unique Token Duality precompile that allows the native gas token
              to simultaneously function as an ERC-20 token. This eliminates the need for
              wrapped tokens and simplifies DeFi integrations.
            </p>
            <ul>
              <li>Use ANDE directly in DEXs and DeFi protocols</li>
              <li>No wrapping/unwrapping required</li>
              <li>Same token for gas and ERC-20 operations</li>
              <li>Full ERC-20 compatibility (transfer, approve, transferFrom)</li>
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
