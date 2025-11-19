import { Metadata } from 'next';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Layers,
  Zap,
  Shield,
  Globe,
  Code,
  Coins,
  Network,
  Rocket,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'About ANDE Network | Sovereign Rollup',
  description: 'Learn about ANDE Network - A sovereign EVM rollup built on Evolve with Celestia DA, featuring Token Duality and MEV redistribution.',
};

// ISR - Regenerate this page every 1 hour
export const revalidate = 3600;

const features = [
  {
    icon: Layers,
    title: 'Sovereign Rollup',
    description: 'Built on Evolve with full sovereignty over execution and settlement. No dependency on L1 for finality.',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    icon: Globe,
    title: 'Celestia DA',
    description: 'Leveraging Celestia for data availability ensures scalability and decentralization without compromise.',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  {
    icon: Coins,
    title: 'Token Duality',
    description: 'Unique precompile allowing native ANDE token to function as both gas token and ERC-20 simultaneously.',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
  },
  {
    icon: Zap,
    title: 'MEV Redistribution',
    description: '80% of MEV goes to stakers, 20% to treasury. Fair value distribution to network participants.',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
  },
  {
    icon: Shield,
    title: 'BFT Consensus',
    description: 'Multi-validator Byzantine Fault Tolerant consensus for security and decentralization.',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  {
    icon: Code,
    title: 'EVM Compatible',
    description: 'Full EVM compatibility via Reth. Deploy your Solidity contracts without modification.',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
  },
];

const stats = [
  { label: 'Chain ID', value: '6174' },
  { label: 'Block Time', value: '~5s' },
  { label: 'Gas Limit', value: '36M' },
  { label: 'Consensus', value: 'BFT' },
];

export default function AboutPage() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-6xl">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <Badge className="mb-4" variant="secondary">
          Sovereign Rollup
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          About ANDE Network
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          A next-generation EVM sovereign rollup combining the power of Evolve execution,
          Celestia data availability, and innovative token economics.
        </p>
      </section>

      {/* Stats Bar */}
      <section className="mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="pt-6 text-center">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="mb-16">
        <Card className="bg-gradient-to-br from-primary/5 to-brand-orange/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rocket className="h-5 w-5" />
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-lg">
              ANDE Network aims to provide a scalable, secure, and developer-friendly blockchain
              infrastructure that empowers the next generation of decentralized applications.
              By combining cutting-edge technology with fair token economics, we're building
              a network that truly serves its community.
            </p>
            <p>
              Our unique Token Duality precompile eliminates the friction between native gas
              tokens and ERC-20 tokens, while our MEV redistribution mechanism ensures that
              value extracted from the network flows back to the participants who secure it.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Features Grid */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Key Features</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Technology Stack */}
      <section className="mb-16">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="h-5 w-5" />
              Technology Stack
            </CardTitle>
            <CardDescription>
              Built with battle-tested, cutting-edge technology
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="font-medium">Execution Layer</span>
                  <Badge variant="secondary">Reth v1.8.2</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="font-medium">EVM</span>
                  <Badge variant="secondary">REVM</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="font-medium">Data Availability</span>
                  <Badge variant="secondary">Celestia</Badge>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="font-medium">Consensus</span>
                  <Badge variant="secondary">BFT Multi-Validator</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="font-medium">Language</span>
                  <Badge variant="secondary">Rust</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="font-medium">Rollup Framework</span>
                  <Badge variant="secondary">Evolve</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* CTA */}
      <section className="text-center">
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="py-12">
            <h2 className="text-2xl font-bold mb-4">Ready to Build on ANDE?</h2>
            <p className="mb-6 opacity-90">
              Start developing your dApps on ANDE Network today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="secondary" asChild>
                <Link href="/docs/getting-started">Get Started</Link>
              </Button>
              <Button variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10" asChild>
                <Link href="https://faucet.ande.network" target="_blank">
                  Get Testnet Tokens
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
