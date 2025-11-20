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
  Wallet,
} from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { SendAndeDialog } from '@/components/send-ande-dialog';

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
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Wallet className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Connect your wallet to send ANDE tokens and view your transaction history.
            </p>
            <ConnectButton />
          </CardContent>
        </Card>
      </div>
    );
  }

  const transactions = data?.items || [];

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header with Send Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Transactions</h1>
          <p className="text-muted-foreground">
            Send ANDE and view your transaction history
          </p>
        </div>
        <SendAndeDialog buttonSize="lg" />
      </div>

      {/* Quick Stats */}
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
            <p className="text-2xl font-bold text-red-500">
              {formatAmount(
                transactions
                  .filter((tx) => tx.from.hash.toLowerCase() === address?.toLowerCase())
                  .reduce((sum, tx) => sum + BigInt(tx.value), BigInt(0))
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
            <p className="text-2xl font-bold text-green-500">
              {formatAmount(
                transactions
                  .filter((tx) => tx.from.hash.toLowerCase() !== address?.toLowerCase())
                  .reduce((sum, tx) => sum + BigInt(tx.value), BigInt(0))
              )} ANDE
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            Your recent transactions on ANDE Network
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <XCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
              <p className="text-lg font-medium">Failed to load transactions</p>
              <p className="text-muted-foreground">Please try again later.</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No transactions yet</p>
              <p className="text-muted-foreground mb-4">
                Your transactions will appear here once you make your first transfer.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <SendAndeDialog />
                <Button variant="outline" asChild>
                  <Link href="https://faucet.ande.network" target="_blank">
                    Get Testnet Tokens
                  </Link>
                </Button>
              </div>
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
                            {formatAmount(BigInt(tx.value))} ANDE
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
    </div>
  );
}
