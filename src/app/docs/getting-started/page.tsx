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
  Wallet,
  Droplets,
  Send,
  CheckCircle2,
  Copy,
  ExternalLink,
  ArrowRight,
  Terminal,
  Code,
  Rocket,
} from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Getting Started | ANDE Documentation',
  description: 'Quick start guide for ANDE Network - configure your wallet, get testnet tokens, and send your first transaction.',
};

const steps = [
  {
    number: 1,
    icon: Wallet,
    title: 'Configure Your Wallet',
    description: 'Add ANDE Network to MetaMask or any EVM-compatible wallet.',
    content: (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Add these network settings to your wallet:
        </p>
        <div className="bg-muted rounded-lg p-4 space-y-2 text-sm font-mono">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Network Name:</span>
            <span>ANDE Network</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">RPC URL:</span>
            <span>https://rpc.ande.network</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Chain ID:</span>
            <span>6174</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Symbol:</span>
            <span>ANDE</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Block Explorer:</span>
            <span>https://explorer.ande.network</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    number: 2,
    icon: Droplets,
    title: 'Get Testnet Tokens',
    description: 'Request free ANDE tokens from our faucet.',
    content: (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Visit the faucet to receive testnet ANDE tokens for testing:
        </p>
        <Button asChild>
          <a href="https://faucet.ande.network" target="_blank" rel="noopener noreferrer">
            <Droplets className="mr-2 h-4 w-4" />
            Go to Faucet
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
        <p className="text-xs text-muted-foreground">
          You can request tokens once every 24 hours per wallet address.
        </p>
      </div>
    ),
  },
  {
    number: 3,
    icon: Send,
    title: 'Send Your First Transaction',
    description: 'Test the network by sending a simple transfer.',
    content: (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Once you have testnet tokens, try sending a small amount to another address
          to verify everything is working correctly.
        </p>
        <div className="bg-muted rounded-lg p-4 text-sm">
          <p className="font-medium mb-2">Using MetaMask:</p>
          <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
            <li>Click "Send" in MetaMask</li>
            <li>Enter recipient address</li>
            <li>Enter amount (e.g., 0.1 ANDE)</li>
            <li>Confirm transaction</li>
            <li>Wait ~5 seconds for confirmation</li>
          </ol>
        </div>
      </div>
    ),
  },
  {
    number: 4,
    icon: CheckCircle2,
    title: 'Verify on Explorer',
    description: 'Check your transaction on the block explorer.',
    content: (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          After sending a transaction, verify it on our block explorer:
        </p>
        <Button variant="outline" asChild>
          <a href="https://explorer.ande.network" target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" />
            Open Block Explorer
          </a>
        </Button>
        <p className="text-xs text-muted-foreground">
          Paste your transaction hash or address to see transaction details, status, and gas used.
        </p>
      </div>
    ),
  },
];

const codeExamples = {
  ethers: `import { ethers } from 'ethers';

// Connect to ANDE Network
const provider = new ethers.JsonRpcProvider('https://rpc.ande.network');

// Get block number
const blockNumber = await provider.getBlockNumber();
console.log('Current block:', blockNumber);

// Get balance
const balance = await provider.getBalance('0x...');
console.log('Balance:', ethers.formatEther(balance), 'ANDE');`,

  viem: `import { createPublicClient, http } from 'viem';
import { defineChain } from 'viem/chains';

const ande = defineChain({
  id: 6174,
  name: 'ANDE Network',
  nativeCurrency: { name: 'ANDE', symbol: 'ANDE', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.ande.network'] },
  },
  blockExplorers: {
    default: { name: 'ANDE Explorer', url: 'https://explorer.ande.network' },
  },
});

const client = createPublicClient({
  chain: ande,
  transport: http(),
});

const blockNumber = await client.getBlockNumber();`,

  cast: `# Get current block number
cast block-number --rpc-url https://rpc.ande.network

# Get balance
cast balance 0x... --rpc-url https://rpc.ande.network

# Send transaction
cast send 0x... --value 0.1ether --rpc-url https://rpc.ande.network --private-key $PK`,
};

export default function GettingStartedPage() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-5xl">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <Badge className="mb-4" variant="secondary">
          Quick Start
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Getting Started
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Get up and running with ANDE Network in minutes. Configure your wallet,
          get testnet tokens, and start building.
        </p>
      </section>

      {/* Prerequisites */}
      <section className="mb-16">
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Rocket className="h-5 w-5" />
              Prerequisites
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>MetaMask or any EVM-compatible wallet</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Basic understanding of Ethereum transactions</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Node.js 18+ (for development)</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Steps */}
      <section className="mb-16">
        <div className="space-y-8">
          {steps.map((step) => (
            <Card key={step.number}>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold flex-shrink-0">
                    {step.number}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <step.icon className="h-5 w-5" />
                      {step.title}
                    </CardTitle>
                    <CardDescription>{step.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pl-18 md:pl-20">
                {step.content}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Code Examples */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Code Examples</h2>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Code className="h-5 w-5" />
                ethers.js
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted rounded-lg p-4 overflow-x-auto text-sm">
                <code>{codeExamples.ethers}</code>
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Code className="h-5 w-5" />
                viem
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted rounded-lg p-4 overflow-x-auto text-sm">
                <code>{codeExamples.viem}</code>
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Terminal className="h-5 w-5" />
                Foundry (cast)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted rounded-lg p-4 overflow-x-auto text-sm">
                <code>{codeExamples.cast}</code>
              </pre>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Next Steps */}
      <section>
        <Card className="bg-gradient-to-br from-primary/5 to-brand-orange/5">
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
            <CardDescription>
              Ready to build? Explore these resources:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/docs/api">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  API Reference
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/docs/developers">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Developer Guide
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <a href="https://github.com/AndeLabs/ande-chain" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  GitHub Repository
                </a>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/staking">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Start Staking
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
