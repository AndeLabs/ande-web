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
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';


function VotingPowerCard() {
    const { votingPower, isLoading } = useGovernance();

    if(isLoading || votingPower.isLoading) {
        return (
            <Card className="text-center">
                <CardHeader>
                <CardTitle>Your Voting Power</CardTitle>
                <CardDescription>The total weight of your vote in proposals.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-12 w-1/2 mx-auto mb-4" />
                    <Skeleton className="h-4 w-1/3 mx-auto" />
                </CardContent>
                <CardFooter className="justify-center">
                    <Button disabled>Delegate Votes</Button>
                </CardFooter>
            </Card>
        )
    }
    
    return (
        <Card className="text-center">
            <CardHeader>
            <CardTitle>Your Voting Power</CardTitle>
            <CardDescription>The total weight of your vote in proposals.</CardDescription>
            </CardHeader>
            <CardContent>
                <>
                <p className="text-5xl font-bold tracking-tight">
                    {votingPower.data ? formatAmount(BigInt(votingPower.data)) : '0'} ANDE
                </p>
                <div className="mt-4 flex justify-center gap-6 text-muted-foreground">
                    <span>Delegated: 0</span>
                    <span>Available: {votingPower.data ? formatAmount(BigInt(votingPower.data)) : '0'}</span>
                </div>
                </>
            </CardContent>
            <CardFooter className="justify-center">
            <Button asChild>
                <Link href="/governance/delegation">Delegate Votes</Link>
            </Button>
            </CardFooter>
      </Card>
    )
}

function ProposalCardSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <div className="flex justify-between">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-1/3" />
                </div>
                <Separator />
                 <Skeleton className="h-4 w-1/2" />
            </CardContent>
            <CardFooter>
                <Skeleton className="h-10 w-full" />
            </CardFooter>
        </Card>
    )
}

function ActiveProposals() {
    const { proposals, isLoading } = useGovernance();

    if(isLoading) {
        return (
             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <ProposalCardSkeleton />
                <ProposalCardSkeleton />
                <ProposalCardSkeleton />
            </div>
        )
    }

    if (!proposals.data || proposals.data.length === 0) {
        return <p>No active proposals.</p>
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {proposals.data.map((proposal: Proposal) => {
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
                        <span>For: {formatAmount(proposal.forVotes)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <XCircle className="h-4 w-4 text-red-500" />
                        <span>Against: {formatAmount(proposal.againstVotes)}</span>
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
            })}
        </div>
    )
}


export default function GovernancePage() {
  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">Governance Hub</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Participate in the future of the ANDE Network.
        </p>
      </div>

      <Suspense fallback={<Card className="text-center"><CardHeader><Skeleton className="h-6 w-1/3 mx-auto" /></CardHeader><CardContent><Skeleton className="h-12 w-1/2 mx-auto" /></CardContent></Card>}>
        <VotingPowerCard />
      </Suspense>


      {/* Active Proposals Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Active Proposals</h2>
            <Button variant="link" asChild>
                <Link href="/governance/proposals">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
        </div>
        <Suspense fallback={<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"><ProposalCardSkeleton /><ProposalCardSkeleton /><ProposalCardSkeleton /></div>}>
            <ActiveProposals />
        </Suspense>
      </div>
    </div>
  );
}
