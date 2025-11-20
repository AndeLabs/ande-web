'use client';

import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { useBalance } from 'packages/blockchain/hooks';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Send,
  AlertCircle,
  Loader2,
  ArrowRight,
  CheckCircle2,
  XCircle,
  ExternalLink,
} from 'lucide-react';
import { useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { parseEther, isAddress, formatUnits } from 'viem';

function truncateAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

interface SendAndeDialogProps {
  children?: ReactNode;
  buttonSize?: 'default' | 'sm' | 'lg' | 'icon';
  buttonVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  buttonClassName?: string;
}

export function SendAndeDialog({
  children,
  buttonSize = 'default',
  buttonVariant = 'default',
  buttonClassName = ''
}: SendAndeDialogProps) {
  const { address } = useAccount();
  const { balance, isLoading: balanceLoading } = useBalance();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState<'form' | 'confirm' | 'pending' | 'success' | 'error'>('form');

  const {
    data: txHash,
    sendTransaction,
    isPending: isSending,
    error: sendError,
    reset: resetSend
  } = useSendTransaction();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: confirmError
  } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setRecipient('');
      setAmount('');
      setStep('form');
      resetSend();
    }
  }, [open, resetSend]);

  // Handle transaction states
  useEffect(() => {
    if (isSending) {
      setStep('pending');
    }
  }, [isSending]);

  useEffect(() => {
    if (isConfirming && txHash) {
      setStep('pending');
    }
  }, [isConfirming, txHash]);

  useEffect(() => {
    if (isConfirmed && txHash) {
      setStep('success');
      toast({
        title: 'Transaction Successful!',
        description: `Sent ${amount} ANDE to ${truncateAddress(recipient)}`,
      });
    }
  }, [isConfirmed, txHash, amount, recipient, toast]);

  useEffect(() => {
    if (sendError || confirmError) {
      setStep('error');
    }
  }, [sendError, confirmError]);

  const availableBalance = balance?.value ? parseFloat(formatUnits(balance.value, 18)) : 0;

  const validateForm = () => {
    if (!recipient) return 'Recipient address is required';
    if (!isAddress(recipient)) return 'Invalid Ethereum address';
    if (recipient.toLowerCase() === address?.toLowerCase()) return 'Cannot send to yourself';
    if (!amount || parseFloat(amount) <= 0) return 'Amount must be greater than 0';
    if (parseFloat(amount) > availableBalance) return 'Insufficient balance';
    return null;
  };

  const handleSend = () => {
    const error = validateForm();
    if (error) {
      toast({
        title: 'Validation Error',
        description: error,
        variant: 'destructive',
      });
      return;
    }
    setStep('confirm');
  };

  const confirmSend = () => {
    try {
      sendTransaction({
        to: recipient as `0x${string}`,
        value: parseEther(amount),
      });
    } catch (err) {
      console.error('Send error:', err);
      setStep('error');
    }
  };

  const setMaxAmount = () => {
    // Leave some for gas (0.001 ANDE)
    const maxAmount = Math.max(0, availableBalance - 0.001);
    setAmount(maxAmount.toFixed(6));
  };

  const errorMessage = sendError?.message || confirmError?.message || 'Transaction failed';

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button size={buttonSize} variant={buttonVariant} className={`gap-2 ${buttonClassName}`}>
            <Send className="h-4 w-4" />
            Send ANDE
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        {step === 'form' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Send ANDE
              </DialogTitle>
              <DialogDescription>
                Transfer ANDE tokens to another address on the network.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Balance Display */}
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Available Balance</p>
                <p className="text-2xl font-bold">
                  {balanceLoading ? (
                    <Skeleton className="h-8 w-32" />
                  ) : (
                    `${availableBalance.toFixed(4)} ANDE`
                  )}
                </p>
              </div>

              {/* Recipient Input */}
              <div className="grid gap-2">
                <Label htmlFor="recipient">Recipient Address</Label>
                <Input
                  id="recipient"
                  placeholder="0x..."
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="font-mono text-sm"
                />
                {recipient && !isAddress(recipient) && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Invalid address format
                  </p>
                )}
              </div>

              {/* Amount Input */}
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="amount">Amount</Label>
                  <button
                    type="button"
                    onClick={setMaxAmount}
                    className="text-xs text-primary hover:underline"
                  >
                    MAX
                  </button>
                </div>
                <div className="relative">
                  <Input
                    id="amount"
                    type="number"
                    step="0.0001"
                    min="0"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pr-16"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    ANDE
                  </span>
                </div>
                {amount && parseFloat(amount) > availableBalance && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Insufficient balance
                  </p>
                )}
              </div>

              {/* Gas Estimate */}
              <div className="text-xs text-muted-foreground">
                <p>Estimated gas: ~0.0001 ANDE</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSend}
                disabled={!recipient || !amount || !!validateForm()}
              >
                Continue
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 'confirm' && (
          <>
            <DialogHeader>
              <DialogTitle>Confirm Transaction</DialogTitle>
              <DialogDescription>
                Please review the transaction details before confirming.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">From</span>
                  <code className="text-sm">{truncateAddress(address || '')}</code>
                </div>
                <div className="flex justify-center">
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">To</span>
                  <code className="text-sm">{truncateAddress(recipient)}</code>
                </div>
              </div>

              <div className="text-center py-4">
                <p className="text-3xl font-bold">{amount} ANDE</p>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                <p className="text-sm text-yellow-600 dark:text-yellow-400 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  This action cannot be undone. Please verify the recipient address.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setStep('form')}>
                Back
              </Button>
              <Button onClick={confirmSend}>
                Confirm & Send
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 'pending' && (
          <>
            <DialogHeader>
              <DialogTitle>Transaction Pending</DialogTitle>
            </DialogHeader>
            <div className="py-8 text-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
              <div>
                <p className="font-medium">
                  {isConfirming ? 'Confirming transaction...' : 'Sending transaction...'}
                </p>
                <p className="text-sm text-muted-foreground">
                  Please wait while we process your transaction.
                </p>
              </div>
              {txHash && (
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-1">Transaction Hash</p>
                  <code className="text-xs break-all">{txHash}</code>
                </div>
              )}
            </div>
          </>
        )}

        {step === 'success' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-green-500">
                <CheckCircle2 className="h-5 w-5" />
                Transaction Successful
              </DialogTitle>
            </DialogHeader>
            <div className="py-6 text-center space-y-4">
              <div className="bg-green-500/10 rounded-full p-4 w-fit mx-auto">
                <CheckCircle2 className="h-12 w-12 text-green-500" />
              </div>
              <div>
                <p className="font-medium">
                  Successfully sent {amount} ANDE
                </p>
                <p className="text-sm text-muted-foreground">
                  to {truncateAddress(recipient)}
                </p>
              </div>
              {txHash && (
                <Button variant="outline" asChild className="gap-2">
                  <a
                    href={`https://explorer.ande.network/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on Explorer
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>
            <DialogFooter>
              <Button onClick={() => setOpen(false)} className="w-full">
                Done
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 'error' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-destructive">
                <XCircle className="h-5 w-5" />
                Transaction Failed
              </DialogTitle>
            </DialogHeader>
            <div className="py-6 text-center space-y-4">
              <div className="bg-destructive/10 rounded-full p-4 w-fit mx-auto">
                <XCircle className="h-12 w-12 text-destructive" />
              </div>
              <div>
                <p className="font-medium">Transaction could not be completed</p>
                <p className="text-sm text-muted-foreground mt-2 break-all">
                  {errorMessage.length > 100
                    ? errorMessage.substring(0, 100) + '...'
                    : errorMessage}
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Close
              </Button>
              <Button onClick={() => setStep('form')}>
                Try Again
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
