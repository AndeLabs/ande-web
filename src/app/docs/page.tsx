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
  BookOpen,
  Code,
  Rocket,
  Terminal,
  FileCode,
  ExternalLink,
  ArrowRight,
  Coins,
  Shield,
  Network,
} from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'ANDE Documentation | Developer Resources',
  description: 'Complete documentation for ANDE Network - guides, API reference, and developer resources.',
};

const quickLinks = [
  {
    title: 'Getting Started',
    description: 'Set up your development environment and deploy your first contract',
    href: '/docs/getting-started',
    icon: Rocket,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  {
    title: 'API Reference',
    description: 'Complete JSON-RPC API documentation and endpoints',
    href: '/docs/api',
    icon: Code,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    title: 'Developer Guide',
    description: 'In-depth guides for building on ANDE Network',
    href: '/docs/developers',
    icon: FileCode,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
];

const resources = [
  {
    title: 'Network Configuration',
    items: [
      { label: 'Chain ID', value: '6174' },
      { label: 'RPC URL', value: 'https://rpc.ande.network' },
      { label: 'Explorer', value: 'https://explorer.ande.network' },
      { label: 'Faucet', value: 'https://faucet.ande.network' },
    ],
  },
  {
    title: 'Contract Addresses',
    items: [
      { label: 'ANDETokenDuality', value: '0x5FC8...F707' },
      { label: 'NativeStaking', value: '0xa513...C853' },
      { label: 'SequencerRegistry', value: '0x6101...D788' },
      { label: 'TimelockController', value: '0x0DCd...31F3' },
    ],
  },
];

const topics = [
  {
    icon: Coins,
    title: 'Token Duality',
    description: 'Learn how ANDE functions as both native and ERC-20 token',
    href: '#',
  },
  {
    icon: Shield,
    title: 'Staking',
    description: 'Stake ANDE to earn rewards and secure the network',
    href: '/staking',
  },
  {
    icon: Network,
    title: 'Celestia DA',
    description: 'Understanding data availability on ANDE',
    href: '#',
  },
];

export default function DocsPage() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-6xl">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <Badge className="mb-4" variant="secondary">
          Documentation
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          ANDE Developer Docs
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Everything you need to build on ANDE Network. Guides, API references,
          and resources for developers.
        </p>
      </section>

      {/* Quick Links */}
      <section className="mb-16">
        <div className="grid gap-6 md:grid-cols-3">
          {quickLinks.map((link) => (
            <Link key={link.title} href={link.href}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${link.bgColor} flex items-center justify-center mb-4`}>
                    <link.icon className={`h-6 w-6 ${link.color}`} />
                  </div>
                  <CardTitle className="flex items-center justify-between">
                    {link.title}
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{link.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Network Info */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Network Information</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {resources.map((resource) => (
            <Card key={resource.title}>
              <CardHeader>
                <CardTitle className="text-lg">{resource.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {resource.items.map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                    <code className="text-sm font-mono">{item.value}</code>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Add to Wallet */}
      <section className="mb-16">
        <Card className="bg-gradient-to-br from-primary/5 to-brand-orange/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Terminal className="h-5 w-5" />
              Add ANDE Network to Wallet
            </CardTitle>
            <CardDescription>
              Configure your wallet to connect to ANDE Network
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="p-4 bg-background rounded-lg overflow-x-auto text-sm">
              <code>{`Network Name: ANDE Network
Chain ID: 6174
RPC URL: https://rpc.ande.network
Symbol: ANDE
Block Explorer: https://explorer.ande.network`}</code>
            </pre>
          </CardContent>
        </Card>
      </section>

      {/* Popular Topics */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Popular Topics</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {topics.map((topic) => (
            <Link key={topic.title} href={topic.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <topic.icon className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-1">{topic.title}</h3>
                      <p className="text-sm text-muted-foreground">{topic.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* External Resources */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              External Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <Button variant="outline" className="justify-start" asChild>
                <a href="https://github.com/AndeLabs/ande-chain" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  GitHub Repository
                </a>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <a href="https://explorer.ande.network" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Block Explorer
                </a>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <a href="https://faucet.ande.network" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Testnet Faucet
                </a>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <a href="https://docs.celestia.org" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Celestia Docs
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
