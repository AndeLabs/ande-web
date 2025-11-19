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
  Vote,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Users,
  Gavel,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

// Mock proposals - in production these would come from the governance contract
const mockProposals = [
  {
    id: 1,
    title: 'Increase Staking Rewards for Heavy Pool',
    description: 'Proposal to increase APY for heavy pool from 25% to 30%',
    status: 'active',
    votesFor: '2,450,000',
    votesAgainst: '890,000',
    endDate: '2025-01-25',
  },
  {
    id: 2,
    title: 'Add New Token to Supported Assets',
    description: 'Add WETH as supported collateral in lending protocol',
    status: 'passed',
    votesFor: '5,200,000',
    votesAgainst: '320,000',
    endDate: '2025-01-18',
  },
  {
    id: 3,
    title: 'Reduce Minimum Stake for Light Pool',
    description: 'Lower minimum stake from 10 to 5 ANDE',
    status: 'failed',
    votesFor: '1,100,000',
    votesAgainst: '3,400,000',
    endDate: '2025-01-10',
  },
];

function getStatusBadge(status: string) {
  switch (status) {
    case 'active':
      return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Active</Badge>;
    case 'passed':
      return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">Passed</Badge>;
    case 'failed':
      return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Failed</Badge>;
    default:
      return <Badge variant="secondary">Pending</Badge>;
  }
}

export default function ProposalsPage() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      {/* Header */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Governance Proposals</h1>
            <p className="text-muted-foreground">
              Vote on proposals to shape the future of ANDE Network
            </p>
          </div>
          <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20">
            Coming Soon
          </Badge>
        </div>
      </section>

      {/* Stats */}
      <section className="mb-8">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6 text-center">
              <FileText className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">Active Proposals</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <CheckCircle2 className="h-6 w-6 mx-auto mb-2 text-green-500" />
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">Passed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Users className="h-6 w-6 mx-auto mb-2 text-purple-500" />
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">Total Voters</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Preview Proposals */}
      <section className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Vote className="h-5 w-5" />
              Preview: Upcoming Proposals
            </CardTitle>
            <CardDescription>
              Example of what governance proposals will look like
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockProposals.map((proposal) => (
                <div
                  key={proposal.id}
                  className="p-4 bg-muted rounded-lg opacity-60"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">{proposal.title}</h3>
                      <p className="text-sm text-muted-foreground">{proposal.description}</p>
                    </div>
                    {getStatusBadge(proposal.status)}
                  </div>
                  <div className="flex items-center justify-between text-sm mt-3">
                    <div className="flex items-center gap-4">
                      <span className="text-green-500">For: {proposal.votesFor}</span>
                      <span className="text-red-500">Against: {proposal.votesAgainst}</span>
                    </div>
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {proposal.endDate}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Coming Soon Info */}
      <section>
        <Card className="bg-gradient-to-br from-primary/5 to-brand-orange/5">
          <CardContent className="py-8 text-center">
            <Gavel className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h2 className="text-xl font-bold mb-2">Governance Coming Q1 2025</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              On-chain governance is currently in development. Soon you'll be able to
              create proposals, vote on changes, and delegate your voting power.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild>
                <Link href="/staking">
                  Stake to Earn Voting Power
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/roadmap">
                  View Roadmap
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
