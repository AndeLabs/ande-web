'use client';

import { useGovernance } from 'packages/blockchain/hooks/useGovernance';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, CheckCircle, Clock, Scale, Sigma, XCircle } from 'lucide-react';
import Link from 'next/link';

// Mock data, to be replaced with real data from useGovernance
const mockProposals = [
  {
    id: 42,
    title: 'Upgrade Sequencer to v2.1',
    category: 'Upgrade',
    deadline: 'in 3 days',
    forVotes: 750000,
    againstVotes: 120000,
    yourVote: null,
  },
  {
    id: 41,
    title: 'Adjust Staking Rewards for Medium Pool',
    category: 'Parameter',
    deadline: 'in 5 days',
    forVotes: 450000,
    againstVotes: 200000,
    yourVote: 'For',
  },
  {
    id: 40,
    title: 'Fund Community Marketing Initiative',
    category: 'Treasury',
    deadline: 'in 10 days',
    forVotes: 980000,
    againstVotes: 50000,
    yourVote: null,
  },
];

const mockStats = [
    { name: 'Total Proposals', value: 42, icon: Sigma },
    { name: 'Active Proposals', value: 3, icon: Clock },
    { name: 'Your Votes Cast', value: 12, icon: CheckCircle },
    { name: 'Voting Power Used', value: '75%', icon: Scale },
]

export default function GovernancePage() {
  const { votingPower } = useGovernance();

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">Governance Hub</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Participate in the future of the ANDE Network.
        </p>
      </div>

      {/* Voting Power Section */}
      <Card className="text-center">
        <CardHeader>
          <CardTitle>Your Voting Power</CardTitle>
          <CardDescription>The total weight of your vote in proposals.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-5xl font-bold tracking-tight">{votingPower.isLoading ? '...' : '1,500'} ANDE</p>
          <div className="mt-4 flex justify-center gap-6 text-muted-foreground">
            <span>Delegated: 0</span>
            <span>Available: 1,500</span>
          </div>
        </CardContent>
        <CardFooter className="justify-center">
          <Button asChild>
            <Link href="/governance/delegation">Delegate Votes</Link>
          </Button>
        </CardFooter>
      </Card>

      {/* Active Proposals Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Active Proposals</h2>
            <Button variant="link" asChild>
                <Link href="/governance/proposals">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockProposals.map(proposal => {
            const totalVotes = proposal.forVotes + proposal.againstVotes;
            const forPercentage = (proposal.forVotes / totalVotes) * 100;
            return (
              <Card key={proposal.id} className="flex flex-col">
                <CardHeader>
                  <CardDescription>Proposal #{proposal.id} &bull; {proposal.category}</CardDescription>
                  <CardTitle>{proposal.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow space-y-4">
                  <Progress value={forPercentage} />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>For: {(proposal.forVotes / 1_000_000).toFixed(2)}M</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <XCircle className="h-4 w-4 text-red-500" />
                      <span>Against: {(proposal.againstVotes / 1_000_000).toFixed(2)}M</span>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Voting ends: {proposal.deadline}</span>
                    {proposal.yourVote && <span className="font-bold">You voted: {proposal.yourVote}</span>}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <Link href={`/governance/vote/${proposal.id}`}>
                      {proposal.yourVote ? 'Change Vote' : 'Vote Now'}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      </div>
      
      {/* Stats Grid */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Network Stats</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {mockStats.map(stat => (
                <Card key={stat.name}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
                        <stat.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{stat.value}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
      </div>

    </div>
  );
}