'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  ChevronRight,
  Code,
  Droplets,
  Globe,
  Lock,
  PieChart,
  Zap,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ServicesSection } from '@/components/services-section';
import placeholderImages from '@/lib/placeholder-images.json';

const featureCards = [
  {
    icon: Globe,
    title: 'Sovereign',
    description:
      'No L1 dependency, providing true autonomy and censorship resistance.',
  },
  {
    icon: Zap,
    title: 'Fast',
    description: 'Experience rapid finality with 5-second block times.',
  },
  {
    icon: Droplets,
    title: 'Cheap',
    description: 'Ultra-low gas fees thanks to Celestia for Data Availability.',
  },
  {
    icon: Lock,
    title: 'Secure',
    description:
      "Fully EVM compatible, inheriting Ethereum's battle-tested security model.",
  },
];

const technologyItems = [
  { name: 'Sovereign EVM Rollup', description: '' },
  { name: 'Celestia for Data Availability', description: '' },
  { name: 'Modified Reth execution', description: '' },
  { name: 'Evolve Sequencer consensus', description: '' },
];

function NetworkStats() {
    const { useBlockNumber, useGasPrice } = require('packages/blockchain/hooks');
    const { formatGwei } = require('viem');
    const { useEffect, useState } = require('react');

    const { data: blockNumber } = useBlockNumber();
    const { data: gasPrice } = useGasPrice();
    const [tps, setTps] = useState('0.0');

    // Placeholder for TPS calculation
    useEffect(() => {
        // In a real app, you'd subscribe to new blocks and calculate TPS.
        // For now, we'll just simulate it.
        const interval = setInterval(() => {
            setTps((Math.random() * 10 + 5).toFixed(1));
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const stats = [
        { name: 'Current Block', value: blockNumber ? blockNumber.toString() : 'Loading...' },
        { name: 'TPS', value: tps },
        { name: 'Average Gas Price', value: gasPrice ? `${Number(formatGwei(gasPrice)).toFixed(2)} Gwei` : 'Loading...' },
        { name: 'Total Addresses', value: '...' },
        { name: 'Total Transactions', value: '...' },
      ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {stats.map((stat) => (
                <div key={stat.name} className="p-4 rounded-lg bg-card text-card-foreground border border-transparent bg-clip-padding 
                before:content-[''] before:absolute before:inset-0 before:z-[-1] before:m-[-1px] before:rounded-[inherit] before:bg-button-gradient
                relative">
                    <h3 className="text-sm font-medium text-muted-foreground">{stat.name}</h3>
                    <p className="text-2xl md:text-3xl font-bold mt-1">{stat.value}</p>
                </div>
            ))}
        </div>
    )
}


export default function Home() {

  return (
    <div className="flex flex-col overflow-hidden">
      {/* Hero Section */}
      <section className="relative w-full h-[80vh] min-h-[600px] overflow-hidden">
        <Image
            src={placeholderImages.abstractNetwork.hero}
            alt="Abstract network"
            fill
            priority
            className="object-cover animate-gradient"
            data-ai-hint="abstract network"
          />
        <div className="absolute inset-0 bg-hero-gradient opacity-90 mix-blend-multiply" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-primary-foreground p-4">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter animate-float">
            The Sovereign Rollup for Latin America
          </h1>
          <p className="mt-4 max-w-2xl text-xl md:text-2xl">
            Fast, Cheap, and Truly Sovereign.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="shadow-glow-orange">
              <Link href="/docs">
                Get Started <ArrowRight className="ml-2" />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/dashboard">
                Launch App
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Live Stats Section */}
      <section id="stats" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <NetworkStats />
        </div>
      </section>

      {/* Services Section */}
      <ServicesSection />

      {/* Key Features Section */}
      <section id="features" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold">
              The Next-Gen Blockchain for LatAm
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-muted-foreground text-lg">
              I will leave this placeholder for you to add real information
              later.
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {featureCards.map(feature => (
              <Card
                key={feature.title}
                className="bg-card/50 backdrop-blur-sm border-white/10 hover:border-primary/50 transition-all hover:shadow-glow-blue"
              >
                <CardHeader>
                  <div className="bg-primary/10 text-primary p-3 rounded-full w-fit">
                    <feature.icon className="h-8 w-8" />
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="mt-2 text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section id="technology" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold">
              Built with Cutting-Edge Tech
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-muted-foreground text-lg">
              I will leave this placeholder for you to add real information
              later.
            </p>
          </div>
          <div className="mt-12 max-w-4xl mx-auto">
            <ul className="space-y-4">
              {technologyItems.map((item, index) => (
                <li
                  key={index}
                  className="bg-card p-4 rounded-lg flex items-center justify-between"
                >
                  <span className="font-medium">{item.name}</span>
                  <ChevronRight className="text-muted-foreground" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Tokenomics Preview Section */}
      <section id="tokenomics" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl md:text-4xl font-bold">ANDE Tokenomics</h2>
              <p className="mt-4 text-muted-foreground text-lg">
                I will leave this placeholder for you to add real information
                later.
              </p>
              <div className="mt-6">
                <h4 className="font-semibold">Staking Rewards</h4>
                <p className="text-muted-foreground mt-2">
                  I will leave this placeholder for you to add real information
                  later.
                </p>
              </div>
              <Button asChild size="lg" className="mt-8">
                <Link href="/tokenomics">
                  View Full Tokenomics <PieChart className="ml-2" />
                </Link>
              </Button>
            </div>
            <div>
              <div className="w-full aspect-square bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">
                  Token Distribution Chart Placeholder
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto text-center">
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Start Building on ANDE
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              I will leave this placeholder for you to add real information
              later.
            </p>
            <div className="mt-8">
              <Button asChild size="lg" className="shadow-lg shadow-primary/30">
                <Link href="/docs">
                  Read the Docs <Code className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
