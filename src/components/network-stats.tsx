'use client';

import { useState } from 'react';
import {
  ArrowRightLeft,
  Cpu,
  ListChecks,
  Network,
  Server,
  Timer,
  Wrench,
} from 'lucide-react';
import { analyzeNetworkHealth } from '@/ai/flows/network-health-analyzer';
import type { NetworkHealthOutput } from '@/ai/flows/network-health-analyzer';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import Image from 'next/image';
import placeholderImages from '@/lib/placeholder-images.json';

const metrics = [
  {
    name: 'Transaction Volume',
    value: '1,234,567',
    unit: 'TXs',
    icon: ArrowRightLeft,
  },
  { name: 'Avg. Block Time', value: '2.1', unit: 's', icon: Timer },
  {
    name: 'Network Utilization',
    value: '65',
    unit: '%',
    icon: Network,
  },
  { name: 'Active Nodes', value: '512', icon: Server },
];

export default function NetworkStats() {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<NetworkHealthOutput | null>(null);
  const { toast } = useToast();

  const handleAnalysis = async () => {
    setLoading(true);
    setAnalysis(null);
    const networkMetrics = JSON.stringify({
      transactionVolume: 1234567,
      blockTime: 2.1,
      networkUtilization: 65,
      activeNodes: 512,
    });
    try {
      const result = await analyzeNetworkHealth({ networkMetrics });
      setAnalysis(result);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description:
          'There was an error analyzing the network health. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const getHealthBadgeVariant = (health: string) => {
    switch (health.toLowerCase()) {
      case 'healthy':
        return 'default';
      case 'degraded':
        return 'secondary';
      case 'critical':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <>
      <section className="relative w-full h-[400px] overflow-hidden rounded-lg">
        <Image
            src={placeholderImages.abstractNetwork.stats}
            alt="Abstract network"
            fill
            className="object-cover"
            data-ai-hint="abstract network"
          />
        <div className="absolute inset-0 bg-hero-gradient opacity-80 mix-blend-multiply" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-primary-foreground p-4">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter animate-float">
            ANDE Network Statistics
          </h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl">
            Real-time insights and AI-powered analysis of the ANDE blockchain.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {metrics.map(metric => (
              <Card key={metric.name} className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {metric.name}
                  </CardTitle>
                  <metric.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {metric.value}
                    {metric.unit && (
                      <span className="text-xs text-muted-foreground ml-1">
                        {metric.unit}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-8 w-full bg-card-gradient text-primary-foreground">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Cpu className="w-8 h-8" />
                <div>
                  <CardTitle className="text-2xl">
                    AI-Powered Health Analysis
                  </CardTitle>
                  <CardDescription className="text-primary-foreground/80">
                    Get an instant, AI-driven analysis of the network's health and
                    performance.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button
                size="lg"
                onClick={handleAnalysis}
                disabled={loading}
                className="bg-primary-foreground text-brand-orange hover:bg-primary-foreground/90 shadow-lg hover:shadow-glow-orange transition-all duration-300"
              >
                {loading ? (
                  <>
                    <LoadingSpinner className="mr-2 h-5 w-5" />
                    Analyzing...
                  </>
                ) : (
                  'Analyze Network Health'
                )}
              </Button>
            </CardContent>

            {analysis && (
              <CardFooter className="flex-col items-start gap-6 text-background bg-black/20 p-6 rounded-b-lg">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">Analysis Results:</h3>
                  <Badge variant={getHealthBadgeVariant(analysis.overallHealth)}>
                    {analysis.overallHealth}
                  </Badge>
                </div>

                <div className="grid md:grid-cols-2 gap-6 w-full">
                  <div>
                    <h4 className="flex items-center gap-2 font-semibold mb-2">
                      <ListChecks className="w-5 h-5" />
                      Potential Issues
                    </h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      {analysis.potentialIssues.map((issue, i) => (
                        <li key={i}>{issue}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="flex items-center gap-2 font-semibold mb-2">
                      <Wrench className="w-5 h-5" />
                      Recommendations
                    </h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      {analysis.recommendations.map((rec, i) => (
                        <li key={i}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardFooter>
            )}
          </Card>
        </div>
      </section>
    </>
  );
}
