'use client';

import { useNetworkHealth } from '@/hooks/useNetworkHealth';
import { useNetworkMetrics } from 'packages/blockchain/hooks';
import { Activity, Zap, Clock, TrendingUp, Users, Blocks } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function NetworkStatsLive() {
  const { data: health } = useNetworkHealth();
  const { stats: blockscoutStats, isLoading } = useNetworkMetrics();

  const stats = [
    {
      name: 'Current Block',
      value: blockscoutStats?.totalBlocks.toLocaleString() || health.blockNumber?.toString() || 'Loading...',
      icon: Activity,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      name: 'Gas Price',
      value: blockscoutStats ? `${blockscoutStats.gasPrice.toFixed(4)} Gwei` : `${health.gasPriceGwei} Gwei`,
      icon: Zap,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
    {
      name: 'Total Transactions',
      value: blockscoutStats?.totalTransactions.toLocaleString() || '...',
      icon: TrendingUp,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      name: 'Total Addresses',
      value: blockscoutStats?.totalAddresses.toLocaleString() || '...',
      icon: Users,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
    {
      name: 'Status',
      value: health.isOnline ? 'Online' : 'Offline',
      icon: Blocks,
      color: health.isOnline ? 'text-green-500' : 'text-red-500',
      bgColor: health.isOnline ? 'bg-green-500/10' : 'bg-red-500/10',
      subtitle: blockscoutStats ? `${blockscoutStats.avgBlockTime.toFixed(1)}s block time` : undefined,
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-background/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Live Network Statistics
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Real-time metrics from the ANDE Network. All data is fetched
            directly from the blockchain.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6"
        >
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div key={stat.name} variants={item}>
                <Card className="relative overflow-hidden group hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div
                      className={`${stat.bgColor} ${stat.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      {stat.name}
                    </h3>
                    <p className="text-2xl md:text-3xl font-bold">
                      {stat.value}
                    </p>
                    {stat.subtitle && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {stat.subtitle}
                      </p>
                    )}
                  </div>
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
