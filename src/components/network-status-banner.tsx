'use client';

import { useNetworkHealth } from '@/hooks/useNetworkHealth';
import { Activity, Zap, Clock } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function NetworkStatusBanner() {
  const { data: health, isLoading } = useNetworkHealth();

  if (isLoading) {
    return null;
  }

  const statusConfig = {
    operational: {
      bg: 'bg-green-500/10',
      border: 'border-green-500/20',
      dot: 'bg-green-500',
      text: 'text-green-500',
      label: 'All Systems Operational',
    },
    degraded: {
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/20',
      dot: 'bg-yellow-500',
      text: 'text-yellow-500',
      label: 'Performance Degraded',
    },
    offline: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
      dot: 'bg-red-500',
      text: 'text-red-500',
      label: 'Network Offline',
    },
    maintenance: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      dot: 'bg-blue-500',
      text: 'text-blue-500',
      label: 'Scheduled Maintenance',
    },
  };

  const config = statusConfig[health.status];

  return (
    <div
      className={cn(
        'border-b px-4 py-2 transition-colors',
        config.bg,
        config.border
      )}
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          {/* Status indicator */}
          <div className="flex items-center gap-2">
            <div
              className={cn(
                'h-2 w-2 rounded-full animate-pulse',
                config.dot
              )}
            />
            <span className={cn('text-sm font-medium', config.text)}>
              {config.label}
            </span>
          </div>

          {/* Network stats */}
          {health.isOnline && (
            <div className="hidden md:flex gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5" />
                <span>
                  Block: {health.blockNumber?.toString() || 'N/A'}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5" />
                <span>Gas: {health.gasPriceGwei} Gwei</span>
              </div>

              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                <span>Latency: {health.latency}ms</span>
              </div>
            </div>
          )}

          {/* Maintenance message */}
          {!health.isOnline && (
            <span className="text-sm text-muted-foreground">
              The ANDE testnet is temporarily offline. Check back soon!
            </span>
          )}
        </div>

        <Link
          href="/network-status"
          className="text-sm hover:underline text-muted-foreground"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
}
