import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Vote, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function VotePage() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <Card className="text-center">
        <CardContent className="py-12">
          <Badge className="mb-4 bg-orange-500/10 text-orange-500 border-orange-500/20">
            Coming Soon
          </Badge>
          <Vote className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-2">Cast Your Vote</h1>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Voting on proposals will be available when governance launches in Q1 2025.
            Stake ANDE tokens now to earn voting power.
          </p>
          <Button asChild>
            <Link href="/governance/proposals">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Proposals
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
