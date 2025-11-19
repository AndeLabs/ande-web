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
  CheckCircle2,
  Circle,
  Clock,
  Rocket,
  Shield,
  Globe,
  Zap,
  Users,
  Code,
  Building,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'ANDE Network Roadmap | Development Timeline',
  description: 'Explore the ANDE Network development roadmap, milestones, and upcoming features.',
};

// ISR - Regenerate this page every 6 hours
export const revalidate = 21600;

type PhaseStatus = 'completed' | 'in-progress' | 'upcoming';

interface Milestone {
  title: string;
  description: string;
  status: 'done' | 'current' | 'pending';
}

interface Phase {
  name: string;
  quarter: string;
  status: PhaseStatus;
  icon: React.ElementType;
  color: string;
  milestones: Milestone[];
}

const phases: Phase[] = [
  {
    name: 'Foundation',
    quarter: 'Q3 2024',
    status: 'completed',
    icon: Building,
    color: 'text-green-500',
    milestones: [
      { title: 'Core Protocol Development', description: 'Reth fork with custom precompiles', status: 'done' },
      { title: 'Token Duality Precompile', description: 'Native + ERC-20 dual functionality', status: 'done' },
      { title: 'Celestia DA Integration', description: 'Data availability layer setup', status: 'done' },
      { title: 'Testnet Launch', description: 'Initial testnet deployment', status: 'done' },
    ],
  },
  {
    name: 'Infrastructure',
    quarter: 'Q4 2024',
    status: 'completed',
    icon: Shield,
    color: 'text-blue-500',
    milestones: [
      { title: 'Block Explorer', description: 'Custom explorer with Blockscout backend', status: 'done' },
      { title: 'Staking Contracts', description: 'Multi-pool native staking system', status: 'done' },
      { title: 'Faucet Service', description: 'Testnet token distribution', status: 'done' },
      { title: 'Web Application', description: 'Main dApp with wallet integration', status: 'done' },
    ],
  },
  {
    name: 'Expansion',
    quarter: 'Q1 2025',
    status: 'in-progress',
    icon: Rocket,
    color: 'text-orange-500',
    milestones: [
      { title: 'Governance System', description: 'On-chain voting and proposals', status: 'current' },
      { title: 'MEV Redistribution', description: '80/20 staker/treasury split', status: 'current' },
      { title: 'Multi-Validator Consensus', description: 'BFT with multiple sequencers', status: 'pending' },
      { title: 'Security Audits', description: 'Third-party security review', status: 'pending' },
    ],
  },
  {
    name: 'Ecosystem',
    quarter: 'Q2 2025',
    status: 'upcoming',
    icon: Globe,
    color: 'text-purple-500',
    milestones: [
      { title: 'Mainnet Launch', description: 'Production network deployment', status: 'pending' },
      { title: 'DEX Integration', description: 'Native AMM deployment', status: 'pending' },
      { title: 'Bridge Protocol', description: 'Cross-chain asset transfers', status: 'pending' },
      { title: 'Developer Grants', description: 'Ecosystem funding program', status: 'pending' },
    ],
  },
  {
    name: 'Growth',
    quarter: 'Q3-Q4 2025',
    status: 'upcoming',
    icon: Users,
    color: 'text-yellow-500',
    milestones: [
      { title: 'SDK & Tools', description: 'Developer SDK and CLI tools', status: 'pending' },
      { title: 'Mobile Wallet', description: 'Native mobile application', status: 'pending' },
      { title: 'Enterprise Partnerships', description: 'B2B integrations', status: 'pending' },
      { title: 'L3 Framework', description: 'Application-specific rollups', status: 'pending' },
    ],
  },
];

function getStatusIcon(status: 'done' | 'current' | 'pending') {
  switch (status) {
    case 'done':
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    case 'current':
      return <Clock className="h-5 w-5 text-orange-500 animate-pulse" />;
    case 'pending':
      return <Circle className="h-5 w-5 text-muted-foreground" />;
  }
}

function getPhaseStatusBadge(status: PhaseStatus) {
  switch (status) {
    case 'completed':
      return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Completed</Badge>;
    case 'in-progress':
      return <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20">In Progress</Badge>;
    case 'upcoming':
      return <Badge variant="secondary">Upcoming</Badge>;
  }
}

export default function RoadmapPage() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-5xl">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <Badge className="mb-4" variant="secondary">
          Development Timeline
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          ANDE Network Roadmap
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Our journey to building a scalable, secure, and decentralized
          EVM sovereign rollup.
        </p>
      </section>

      {/* Timeline */}
      <section className="relative">
        {/* Vertical Line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border hidden md:block" />

        <div className="space-y-8">
          {phases.map((phase, index) => (
            <div key={phase.name} className="relative">
              {/* Phase Icon */}
              <div className="absolute left-0 top-0 hidden md:flex items-center justify-center w-16 h-16">
                <div className={`w-12 h-12 rounded-full bg-background border-2 flex items-center justify-center ${
                  phase.status === 'completed' ? 'border-green-500' :
                  phase.status === 'in-progress' ? 'border-orange-500' :
                  'border-muted'
                }`}>
                  <phase.icon className={`h-6 w-6 ${phase.color}`} />
                </div>
              </div>

              {/* Phase Card */}
              <Card className="md:ml-24">
                <CardHeader>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <div className="md:hidden">
                        <phase.icon className={`h-6 w-6 ${phase.color}`} />
                      </div>
                      <div>
                        <CardTitle>{phase.name}</CardTitle>
                        <CardDescription>{phase.quarter}</CardDescription>
                      </div>
                    </div>
                    {getPhaseStatusBadge(phase.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {phase.milestones.map((milestone) => (
                      <div
                        key={milestone.title}
                        className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                      >
                        {getStatusIcon(milestone.status)}
                        <div className="flex-1">
                          <p className="font-medium">{milestone.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {milestone.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </section>

      {/* Note */}
      <section className="mt-16">
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">
              This roadmap is subject to change based on community feedback and technical requirements.
              Follow our announcements for the latest updates.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
