import { Metadata } from 'next';
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
  ArrowLeftRight,
  TrendingUp,
  Vault,
  Droplets,
  Shield,
  Zap,
  Clock,
  Bell,
  ExternalLink,
  Coins,
  BarChart3,
  Lock,
} from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'DeFi | ANDE Network',
  description: 'Decentralized Finance on ANDE Network - AMM, Lending, Yield Farming, and more coming soon.',
};

const upcomingFeatures = [
  {
    icon: ArrowLeftRight,
    title: 'Native DEX',
    description: 'Swap tokens instantly with our built-in AMM. Low fees powered by Token Duality - no wrapped tokens needed.',
    status: 'Q2 2025',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    icon: Vault,
    title: 'Lending Protocol',
    description: 'Supply assets to earn interest or borrow against your collateral with competitive rates.',
    status: 'Q2 2025',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  {
    icon: Droplets,
    title: 'Liquidity Pools',
    description: 'Provide liquidity to trading pairs and earn fees plus ANDE rewards.',
    status: 'Q2 2025',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  {
    icon: TrendingUp,
    title: 'Yield Farming',
    description: 'Stake LP tokens to earn additional ANDE rewards with boosted APY for long-term stakers.',
    status: 'Q3 2025',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
  },
  {
    icon: Lock,
    title: 'Vaults',
    description: 'Auto-compounding vaults that optimize your yield farming strategies automatically.',
    status: 'Q3 2025',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
  },
  {
    icon: BarChart3,
    title: 'Analytics',
    description: 'Real-time DeFi analytics, portfolio tracking, and yield comparisons.',
    status: 'Q3 2025',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
  },
];

const benefits = [
  {
    icon: Coins,
    title: 'Token Duality Advantage',
    description: 'Use ANDE directly in DeFi protocols without wrapping. Seamless integration across all platforms.',
  },
  {
    icon: Zap,
    title: 'Fast & Cheap',
    description: '~5 second blocks with low gas fees. Execute complex DeFi strategies without breaking the bank.',
  },
  {
    icon: Shield,
    title: 'MEV Protection',
    description: '80% of MEV goes back to stakers. Fairer trading with reduced sandwich attack impact.',
  },
  {
    icon: TrendingUp,
    title: 'Composable',
    description: 'Full EVM compatibility means your favorite DeFi protocols can deploy without modification.',
  },
];

export default function DefiPage() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-6xl">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <Badge className="mb-4 bg-orange-500/10 text-orange-500 border-orange-500/20">
          Coming Soon
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          DeFi on ANDE
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          The complete DeFi ecosystem is coming to ANDE Network. Swap, lend, farm,
          and earn - all powered by Token Duality and fair MEV redistribution.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild>
            <Link href="/staking">
              <Shield className="mr-2 h-4 w-4" />
              Stake Now
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/roadmap">
              <Clock className="mr-2 h-4 w-4" />
              View Roadmap
            </Link>
          </Button>
        </div>
      </section>

      {/* Current Stats */}
      <section className="mb-16">
        <Card className="bg-gradient-to-br from-primary/5 to-brand-orange/5">
          <CardContent className="py-8">
            <div className="grid gap-6 md:grid-cols-4 text-center">
              <div>
                <p className="text-3xl font-bold">$0</p>
                <p className="text-sm text-muted-foreground">Total Value Locked</p>
              </div>
              <div>
                <p className="text-3xl font-bold">0</p>
                <p className="text-sm text-muted-foreground">Active Pools</p>
              </div>
              <div>
                <p className="text-3xl font-bold">0</p>
                <p className="text-sm text-muted-foreground">Protocols</p>
              </div>
              <div>
                <p className="text-3xl font-bold">Q2 2025</p>
                <p className="text-sm text-muted-foreground">Launch Target</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Upcoming Features */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Upcoming Features</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {upcomingFeatures.map((feature) => (
            <Card key={feature.title} className="relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <Badge variant="secondary" className="text-xs">
                  {feature.status}
                </Badge>
              </div>
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Why DeFi on ANDE?</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {benefits.map((benefit) => (
            <Card key={benefit.title}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* For Developers */}
      <section className="mb-16">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              For DeFi Developers
            </CardTitle>
            <CardDescription>
              Build the next generation of DeFi on ANDE
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                ANDE Network is fully EVM compatible. Deploy your existing Solidity contracts
                without modification, or build new protocols that leverage our unique features:
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Coins className="h-4 w-4 text-primary" />
                  <span>Token Duality precompile at address 0xFD for native ERC-20 integration</span>
                </li>
                <li className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <span>MEV redistribution for fairer protocol economics</span>
                </li>
                <li className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span>Low gas costs enable complex multi-hop strategies</span>
                </li>
              </ul>
              <div className="flex gap-4 pt-4">
                <Button variant="outline" asChild>
                  <Link href="/docs/developers">
                    Developer Docs
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <a href="https://github.com/AndeLabs/ande-chain" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    GitHub
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Stay Updated CTA */}
      <section>
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="py-12 text-center">
            <Bell className="h-12 w-12 mx-auto mb-4 opacity-80" />
            <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
            <p className="mb-6 opacity-90 max-w-2xl mx-auto">
              Be the first to know when DeFi launches on ANDE. Follow us on Twitter
              for announcements, early access opportunities, and developer grants.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="secondary" asChild>
                <a href="https://twitter.com/andechain" target="_blank" rel="noopener noreferrer">
                  Follow @andechain
                </a>
              </Button>
              <Button variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10" asChild>
                <a href="https://github.com/AndeLabs" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  GitHub
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
