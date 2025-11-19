'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Calculator,
  TrendingUp,
  Clock,
  Coins,
  ArrowRight,
  Info,
} from 'lucide-react';
import Link from 'next/link';

const pools = [
  {
    id: 'light',
    name: 'Light Pool',
    apy: 5,
    lockup: 0,
    lockupLabel: 'No lockup',
    minStake: 10,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  {
    id: 'medium',
    name: 'Medium Pool',
    apy: 12,
    lockup: 90,
    lockupLabel: '3 months',
    minStake: 100,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    id: 'heavy',
    name: 'Heavy Pool',
    apy: 25,
    lockup: 180,
    lockupLabel: '6 months',
    minStake: 500,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
  },
];

const durations = [
  { label: '1 Month', days: 30 },
  { label: '3 Months', days: 90 },
  { label: '6 Months', days: 180 },
  { label: '1 Year', days: 365 },
];

export default function StakingCalculatorPage() {
  const [amount, setAmount] = useState<string>('1000');
  const [selectedPool, setSelectedPool] = useState<string>('medium');
  const [selectedDuration, setSelectedDuration] = useState<number>(365);

  const pool = pools.find(p => p.id === selectedPool) || pools[1];
  const stakeAmount = parseFloat(amount) || 0;

  // Calculate rewards
  const dailyRate = pool.apy / 100 / 365;
  const rewards = stakeAmount * dailyRate * selectedDuration;
  const totalReturn = stakeAmount + rewards;
  const effectiveAPY = stakeAmount > 0 ? (rewards / stakeAmount) * (365 / selectedDuration) * 100 : 0;

  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      {/* Header */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/staking">
              ← Back to Staking
            </Link>
          </Button>
        </div>
        <h1 className="text-3xl font-bold mb-2">Staking Calculator</h1>
        <p className="text-muted-foreground">
          Estimate your potential staking rewards
        </p>
      </section>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Input Section */}
        <div className="space-y-6">
          {/* Stake Amount */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Coins className="h-5 w-5" />
                Stake Amount
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (ANDE)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="0"
                />
                <div className="flex gap-2 mt-2">
                  {[100, 500, 1000, 5000].map((preset) => (
                    <Button
                      key={preset}
                      variant="outline"
                      size="sm"
                      onClick={() => setAmount(preset.toString())}
                      className={amount === preset.toString() ? 'border-primary' : ''}
                    >
                      {preset}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Select Pool */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5" />
                Select Pool
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pools.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPool(p.id)}
                    className={`w-full p-4 rounded-lg border text-left transition-colors ${
                      selectedPool === p.id
                        ? `${p.bgColor} border-current ${p.color}`
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{p.name}</span>
                      <Badge variant="secondary">{p.apy}% APY</Badge>
                    </div>
                    <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
                      <span>{p.lockupLabel}</span>
                      <span>Min: {p.minStake} ANDE</span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Duration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5" />
                Duration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {durations.map((d) => (
                  <Button
                    key={d.days}
                    variant={selectedDuration === d.days ? 'default' : 'outline'}
                    onClick={() => setSelectedDuration(d.days)}
                    className="w-full"
                  >
                    {d.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-primary/5 to-brand-orange/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Estimated Returns
              </CardTitle>
              <CardDescription>
                Based on {pool.name} at {pool.apy}% APY
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Rewards */}
              <div className="text-center p-6 bg-background rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Estimated Rewards</p>
                <p className="text-4xl font-bold text-green-500">
                  {rewards.toFixed(2)} ANDE
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  After {durations.find(d => d.days === selectedDuration)?.label.toLowerCase()}
                </p>
              </div>

              {/* Breakdown */}
              <div className="space-y-3">
                <div className="flex justify-between p-3 bg-background rounded-lg">
                  <span className="text-muted-foreground">Initial Stake</span>
                  <span className="font-mono">{stakeAmount.toFixed(2)} ANDE</span>
                </div>
                <div className="flex justify-between p-3 bg-background rounded-lg">
                  <span className="text-muted-foreground">Rewards</span>
                  <span className="font-mono text-green-500">+{rewards.toFixed(2)} ANDE</span>
                </div>
                <div className="flex justify-between p-3 bg-background rounded-lg border-2 border-primary">
                  <span className="font-medium">Total Return</span>
                  <span className="font-mono font-bold">{totalReturn.toFixed(2)} ANDE</span>
                </div>
              </div>

              {/* APY */}
              <div className="text-center p-4 bg-background rounded-lg">
                <p className="text-sm text-muted-foreground">Effective APY</p>
                <p className="text-2xl font-bold">{effectiveAPY.toFixed(2)}%</p>
              </div>
            </CardContent>
          </Card>

          {/* Info */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <p className="mb-2">
                    These estimates are based on current APY rates and assume rewards are not compounded.
                    Actual returns may vary based on network conditions and MEV rewards.
                  </p>
                  <p>
                    MEV redistribution (80% to stakers) provides additional rewards not included in this calculation.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <Button className="w-full" size="lg" asChild>
            <Link href={`/staking/${selectedPool}`}>
              Stake in {pool.name}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
