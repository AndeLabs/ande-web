'use client';

import { useAccount } from 'wagmi';
import { useAddressTransactions } from 'packages/blockchain/hooks';
import { formatAmount } from 'packages/blockchain/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ArrowUpRight,
  ArrowDownLeft,
  ExternalLink,
  Copy,
  CheckCircle2,
  XCircle,
  Clock,
} from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

function truncateAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function formatTimestamp(timestamp: string) {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
}

export default function TransactionsPage() {
  const { address, isConnected } = useAccount();
  const { data, isLoading, error } = useAddressTransactions(address);
  const { toast } = useToast();
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedHash(text);
    toast({
      title: 'Copied!',
      description: 'Transaction hash copied to clipboard',
    });
    setTimeout(() => setCopiedHash(null), 2000);
  };

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            Connect your wallet to view your transaction history.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Please connect your wallet to see your transactions on ANDE Network.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Loading your transactions...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Error loading transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">
            Failed to load transactions. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  const transactions = data?.items || [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            Your recent transactions on ANDE Network
          </CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No transactions yet</p>
              <p className="text-muted-foreground">
                Your transactions will appear here once you make your first transfer.
              </p>
              <Button asChild className="mt-4">
                <Link href="https://faucet.ande.network" target="_blank">
                  Get Testnet Tokens
                </Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Hash</TableHead>
                    <TableHead>From/To</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => {
                    const isOutgoing = tx.from.hash.toLowerCase() === address?.toLowerCase();
                    const otherParty = isOutgoing ? tx.to?.hash : tx.from.hash;

                    return (
                      <TableRow key={tx.hash}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {isOutgoing ? (
                              <ArrowUpRight className="h-4 w-4 text-red-500" />
                            ) : (
                              <ArrowDownLeft className="h-4 w-4 text-green-500" />
                            )}
                            <span className="text-sm font-medium">
                              {isOutgoing ? 'Sent' : 'Received'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <code className="text-xs">
                              {truncateAddress(tx.hash)}
                            </code>
                            <button
                              onClick={() => copyToClipboard(tx.hash)}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              {copiedHash === tx.hash ? (
                                <CheckCircle2 className="h-3 w-3 text-green-500" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </button>
                          </div>
                        </TableCell>
                        <TableCell>
                          {otherParty ? (
                            <code className="text-xs">
                              {truncateAddress(otherParty)}
                            </code>
                          ) : (
                            <span className="text-muted-foreground text-xs">
                              Contract Creation
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="font-mono">
                            {formatAmount(BigInt(tx.value), 18, 4)} ANDE
                          </span>
                        </TableCell>
                        <TableCell>
                          {tx.status === 'ok' ? (
                            <Badge variant="default" className="bg-green-500/10 text-green-500 border-green-500/20">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Success
                            </Badge>
                          ) : (
                            <Badge variant="destructive">
                              <XCircle className="h-3 w-3 mr-1" />
                              Failed
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {formatTimestamp(tx.timestamp)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                          >
                            <a
                              href={`https://explorer.ande.network/tx/${tx.hash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transaction Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{transactions.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Sent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {formatAmount(
                transactions
                  .filter((tx) => tx.from.hash.toLowerCase() === address?.toLowerCase())
                  .reduce((sum, tx) => sum + BigInt(tx.value), BigInt(0)),
                18,
                2
              )} ANDE
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Received
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {formatAmount(
                transactions
                  .filter((tx) => tx.from.hash.toLowerCase() !== address?.toLowerCase())
                  .reduce((sum, tx) => sum + BigInt(tx.value), BigInt(0)),
                18,
                2
              )} ANDE
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
