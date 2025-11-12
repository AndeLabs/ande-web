'use client';

import { useNetworkHealth } from '@/hooks/useNetworkHealth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Zap, Clock, CheckCircle2, XCircle, AlertTriangle, Server } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';

interface ServiceStatus {
  name: string;
  status: 'operational' | 'degraded' | 'offline';
  description: string;
  icon: typeof Server;
}

export function NetworkStatusPage() {
  const { data: health, isLoading } = useNetworkHealth();

  // Fetch API health check
  const { data: apiHealth } = useQuery({
    queryKey: ['api-health'],
    queryFn: async () => {
      const response = await fetch('/api/health');
      return response.json();
    },
    refetchInterval: 30_000, // 30 seconds
  });

  const services: ServiceStatus[] = [
    {
      name: 'RPC Endpoint',
      status: health.isOnline ? 'operational' : 'offline',
      description: 'https://rpc.ande.network',
      icon: Server,
    },
    {
      name: 'Block Explorer',
      status: 'operational',
      description: 'https://explorer.ande.network',
      icon: Activity,
    },
    {
      name: 'Testnet Faucet',
      status: 'operational',
      description: 'Distributing ANDE tokens',
      icon: Zap,
    },
    {
      name: 'Website',
      status: 'operational',
      description: 'https://ande.network',
      icon: CheckCircle2,
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'degraded':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'offline':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      operational: 'bg-green-500/10 text-green-500 border-green-500/20',
      degraded: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      offline: 'bg-red-500/10 text-red-500 border-red-500/20',
    };

    return (
      <span
        className={cn(
          'px-2.5 py-0.5 rounded-full text-xs font-medium border',
          styles[status as keyof typeof styles]
        )}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Network Status</h1>
        <p className="text-muted-foreground text-lg">
          Real-time monitoring of ANDE Network infrastructure and services
        </p>
      </div>

      {/* Overall Status */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            {getStatusIcon(health.status)}
            Overall System Status
          </CardTitle>
          <CardDescription>
            Last updated: {new Date(health.lastUpdated).toLocaleString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            {getStatusBadge(health.status)}
            <span className="text-sm text-muted-foreground">
              {health.status === 'operational' && 'All systems are operational'}
              {health.status === 'degraded' && 'Some systems are experiencing issues'}
              {health.status === 'offline' && 'Network is currently offline - scheduled maintenance'}
              {health.status === 'maintenance' && 'Scheduled maintenance in progress'}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Network Metrics */}
      {health.isOnline && (
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Current Block
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {health.blockNumber?.toString() || 'N/A'}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Latest block height
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gas Price</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{health.gasPriceGwei}</div>
              <p className="text-xs text-muted-foreground mt-1">Gwei</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">RPC Latency</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{health.latency}ms</div>
              <p className="text-xs text-muted-foreground mt-1">
                Average response time
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Service Status */}
      <Card>
        <CardHeader>
          <CardTitle>Services</CardTitle>
          <CardDescription>
            Status of individual ANDE Network services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.name}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h3 className="font-medium">{service.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {service.description}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(service.status)}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* API Health Details */}
      {apiHealth && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>API Health Check</CardTitle>
            <CardDescription>
              Detailed health status from /api/health endpoint
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">Overall Status:</span>
                <span
                  className={cn(
                    'font-semibold',
                    apiHealth.status === 'healthy'
                      ? 'text-green-500'
                      : 'text-red-500'
                  )}
                >
                  {apiHealth.status}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Timestamp:</span>
                <span className="text-muted-foreground">
                  {new Date(apiHealth.timestamp).toLocaleString()}
                </span>
              </div>
              {apiHealth.checks?.blockHeight?.blockNumber && (
                <div className="flex justify-between items-center">
                  <span className="font-medium">Block Height:</span>
                  <span className="text-muted-foreground">
                    {apiHealth.checks.blockHeight.blockNumber}
                  </span>
                </div>
              )}
              {apiHealth.checks?.gasPrice?.gasPrice && (
                <div className="flex justify-between items-center">
                  <span className="font-medium">Gas Price:</span>
                  <span className="text-muted-foreground">
                    {apiHealth.checks.gasPrice.gasPrice}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Maintenance Notice */}
      {!health.isOnline && (
        <Card className="mt-8 border-blue-500/20 bg-blue-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-500">
              <AlertTriangle className="h-5 w-5" />
              Scheduled Maintenance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              The ANDE Network testnet is currently offline for scheduled
              maintenance. We expect to be back online soon. Follow our social
              media channels for real-time updates.
            </p>
            <div className="mt-4 flex gap-4">
              <a
                href="https://twitter.com/ANDENetwork"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-500 hover:underline"
              >
                Twitter →
              </a>
              <a
                href="https://discord.gg/ande"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-500 hover:underline"
              >
                Discord →
              </a>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
