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
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { formatAmount } from 'packages/blockchain/utils';
import { Proposal } from 'packages/blockchain/types';

export default function GovernancePage() {
  const { proposals, votingPower, isLoading } = useGovernance();

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
          {isLoading || votingPower.isLoading ? (
            <LoadingSpinner className="mx-auto h-12 w-12" />
          ) : (
            <>
              <p className="text-5xl font-bold tracking-tight">
                {votingPower.data ? formatAmount(BigInt(votingPower.data), 18, 2) : '0'} ANDE
              </p>
              <div className="mt-4 flex justify-center gap-6 text-muted-foreground">
                <span>Delegated: 0</span>
                <span>Available: {votingPower.data ? formatAmount(BigInt(votingPower.data), 18, 2) : '0'}</span>
              </div>
            </>
          )}
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
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}><CardHeader><CardTitle>Loading...</CardTitle></CardHeader><CardContent><LoadingSpinner /></CardContent></Card>
            ))
          ) : proposals.data && proposals.data.length > 0 ? (
            proposals.data.map((proposal: Proposal) => {
              const totalVotes = proposal.forVotes + proposal.againstVotes;
              const forPercentage = totalVotes > 0 ? Number((proposal.forVotes * 100n) / totalVotes) : 0;
              return (
                <Card key={String(proposal.id)} className="flex flex-col">
                  <CardHeader>
                    <CardDescription>Proposal #{String(proposal.id)}</CardDescription>
                    <CardTitle>{proposal.description}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-4">
                    <Progress value={forPercentage} />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>For: {formatAmount(proposal.forVotes, 18, 2)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <XCircle className="h-4 w-4 text-red-500" />
                        <span>Against: {formatAmount(proposal.againstVotes, 18, 2)}</span>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Voting ends: ...</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" asChild>
                      <Link href={`/governance/vote/${proposal.id}`}>
                        Vote Now
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              )
            })
          ) : (
            <p>No active proposals.</p>
          )}
        </div>
      </div>
    </div>
  );
}
