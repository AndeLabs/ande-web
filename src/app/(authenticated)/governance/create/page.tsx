import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FilePlus, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CreateProposalPage() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <Card className="text-center">
        <CardContent className="py-12">
          <Badge className="mb-4 bg-orange-500/10 text-orange-500 border-orange-500/20">
            Coming Soon
          </Badge>
          <FilePlus className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-2">Create Proposal</h1>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Proposal creation will be available once governance launches in Q1 2025.
            Stake ANDE tokens now to earn voting power.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild>
              <Link href="/governance/proposals">
                View All Proposals
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/staking">Stake ANDE</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
