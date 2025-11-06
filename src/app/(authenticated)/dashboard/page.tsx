import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowRightLeft,
  Coins,
  Plus,
  Send,
  Vote,
  Wallet,
} from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="grid gap-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Overview</CardTitle>
            <CardDescription>Your total balance and recent performance.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
                I will leave this placeholder for you to add real information later.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Staking Summary</CardTitle>
            <CardDescription>Your current staking positions and rewards.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
                I will leave this placeholder for you to add real information later.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Governance</CardTitle>
            <CardDescription>Active proposals and your voting power.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
                I will leave this placeholder for you to add real information later.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
             <CardDescription>Quick access to common actions.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button variant="outline"><Send className="mr-2 h-4 w-4" /> Send ANDE</Button>
            <Button variant="outline"><Coins className="mr-2 h-4 w-4" /> Stake ANDE</Button>
            <Button variant="outline"><Vote className="mr-2 h-4 w-4" /> Vote on Proposal</Button>
            <Button variant="outline"><Plus className="mr-2 h-4 w-4" /> Add Liquidity</Button>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your last 10 transactions on the network.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            I will leave this placeholder for you to add real information later.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
