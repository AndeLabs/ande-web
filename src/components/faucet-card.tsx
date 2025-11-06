'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAccount } from 'wagmi';
import { isAddress } from 'viem';
import { Droplet, CheckCircle2, AlertCircle, Loader2, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

/**
 * Faucet Component
 * 
 * Connects to the ANDE faucet backend service running at faucet.ande.network
 * Allows users to request testnet ANDE tokens for development
 * 
 * Backend: Docker service on port 8081 (chainfaucet/eth-faucet)
 * Rate Limit: 1 request per address per 24 hours
 * Amount: 10 ANDE per request (configurable)
 */

interface FaucetResponse {
  success: boolean;
  txHash?: string;
  message?: string;
  error?: string;
}

const FAUCET_API_URL = process.env.NEXT_PUBLIC_FAUCET_URL || 'https://faucet.ande.network';
const FAUCET_AMOUNT = process.env.NEXT_PUBLIC_FAUCET_AMOUNT || '10';
const COOLDOWN_HOURS = 24;

export function FaucetCard() {
  const { address: connectedAddress, isConnected } = useAccount();
  const { toast } = useToast();
  
  const [customAddress, setCustomAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastRequestTime, setLastRequestTime] = useState<number | null>(null);

  const targetAddress = customAddress || connectedAddress;
  const isValidAddress = targetAddress && isAddress(targetAddress);

  // Check if user is in cooldown period
  const isInCooldown = lastRequestTime && 
    Date.now() - lastRequestTime < COOLDOWN_HOURS * 60 * 60 * 1000;

  const timeUntilNextRequest = isInCooldown && lastRequestTime
    ? Math.ceil((COOLDOWN_HOURS * 60 * 60 * 1000 - (Date.now() - lastRequestTime)) / (60 * 1000))
    : 0;

  const requestTokens = async () => {
    if (!isValidAddress) {
      toast({
        title: 'Invalid Address',
        description: 'Please enter a valid Ethereum address or connect your wallet',
        variant: 'destructive',
      });
      return;
    }

    if (isInCooldown) {
      toast({
        title: 'Cooldown Active',
        description: `Please wait ${timeUntilNextRequest} minutes before requesting again`,
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      // Try multiple endpoints for compatibility
      const endpoints = [
        `${FAUCET_API_URL}/api/claim`,        // eth-faucet v2
        `${FAUCET_API_URL}/claim`,            // eth-faucet v1
        `${FAUCET_API_URL}/api/faucet/claim`, // alternative
      ];

      let response: Response | null = null;
      let lastError: Error | null = null;

      for (const endpoint of endpoints) {
        try {
          response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              address: targetAddress,
            }),
          });

          // If we get a response (even 405), stop trying other endpoints
          if (response) break;
        } catch (e) {
          lastError = e instanceof Error ? e : new Error('Network error');
          continue;
        }
      }

      if (!response) {
        throw lastError || new Error('Could not connect to faucet service');
      }

      // Handle different response formats
      let data: FaucetResponse;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        // If not JSON, assume success for 2xx responses
        if (response.ok) {
          data = { success: true };
        } else {
          throw new Error(`Faucet responded with status ${response.status}`);
        }
      }

      if (response.ok && data.success) {
        setLastRequestTime(Date.now());
        toast({
          title: 'Success!',
          description: (
            <div className="space-y-1">
              <p>{FAUCET_AMOUNT} ANDE sent to your address</p>
              {data.txHash && (
                <a 
                  href={`https://explorer.ande.network/tx/${data.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-500 hover:underline block"
                >
                  View transaction →
                </a>
              )}
            </div>
          ),
        });
        setCustomAddress('');
      } else {
        const errorMsg = data.error || data.message || `Request failed with status ${response.status}`;
        throw new Error(errorMsg);
      }
    } catch (error) {
      console.error('Faucet error:', error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to request tokens. Please try again later.';
      
      toast({
        title: 'Request Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Droplet className="h-6 w-6 text-blue-500" />
          AndeChain Testnet Faucet
        </CardTitle>
        <CardDescription>
          Request {FAUCET_AMOUNT} ANDE tokens every {COOLDOWN_HOURS} hours for testing and development
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Info Alert */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>What is a faucet?</strong> A faucet provides free testnet tokens for developers. 
            These tokens have no real value and are only for testing on AndeChain Testnet.
          </AlertDescription>
        </Alert>

        {/* Address Input */}
        <div className="space-y-3">
          {isConnected && connectedAddress ? (
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <Label className="text-sm font-medium">Connected Wallet</Label>
              <p className="text-sm font-mono break-all">{connectedAddress}</p>
              <p className="text-xs text-muted-foreground">
                Tokens will be sent to this address
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="address">Wallet Address</Label>
              <Input
                id="address"
                value={customAddress}
                onChange={(e) => setCustomAddress(e.target.value)}
                placeholder="0x..."
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Enter an Ethereum address or connect your wallet above
              </p>
            </div>
          )}
        </div>

        {/* Cooldown Warning */}
        {isInCooldown && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You can request tokens again in {timeUntilNextRequest} minutes
            </AlertDescription>
          </Alert>
        )}

        {/* Request Button */}
        <Button
          onClick={requestTokens}
          disabled={loading || !isValidAddress || isInCooldown}
          className="w-full"
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Requesting...
            </>
          ) : (
            <>
              <Droplet className="mr-2 h-4 w-4" />
              Request {FAUCET_AMOUNT} ANDE
            </>
          )}
        </Button>

        {/* Info Section */}
        <div className="pt-4 border-t space-y-3">
          <div className="flex items-start gap-2 text-sm">
            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Testnet Only</p>
              <p className="text-xs text-muted-foreground">
                These tokens work on AndeChain Testnet (Chain ID: 6174)
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-2 text-sm">
            <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">No Real Value</p>
              <p className="text-xs text-muted-foreground">
                Test tokens have no monetary value and cannot be exchanged for real money
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2 text-sm">
            <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Rate Limit</p>
              <p className="text-xs text-muted-foreground">
                1 request per address every {COOLDOWN_HOURS} hours to prevent abuse
              </p>
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="pt-4 border-t flex flex-wrap gap-3 text-sm">
          <a
            href="https://explorer.ande.network"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            Block Explorer →
          </a>
          <a
            href="https://rpc.ande.network"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            RPC Endpoint →
          </a>
          <a
            href="/docs"
            className="text-blue-500 hover:underline"
          >
            Documentation →
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
