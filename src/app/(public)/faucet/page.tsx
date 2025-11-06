import { FaucetCard } from '@/components/faucet-card';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Faucet - AndeChain Testnet',
  description: 'Request free ANDE testnet tokens for development and testing on AndeChain',
};

export default function FaucetPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="mb-8 text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Testnet Faucet</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Get free ANDE tokens to start building and testing on AndeChain Testnet
        </p>
      </div>

      <FaucetCard />

      {/* Additional Information */}
      <div className="mt-12 max-w-2xl mx-auto space-y-6">
        <div className="prose prose-sm dark:prose-invert">
          <h2>Getting Started</h2>
          <ol>
            <li>Connect your wallet or enter an address</li>
            <li>Click "Request ANDE" to receive test tokens</li>
            <li>Wait for the transaction to confirm</li>
            <li>Start building on AndeChain!</li>
          </ol>

          <h2>Network Information</h2>
          <ul>
            <li><strong>Chain ID:</strong> 6174</li>
            <li><strong>Network Name:</strong> AndeChain Testnet</li>
            <li><strong>RPC URL:</strong> https://rpc.ande.network</li>
            <li><strong>Explorer:</strong> https://explorer.ande.network</li>
          </ul>

          <h2>Need Help?</h2>
          <p>
            If you're experiencing issues with the faucet, please check our{' '}
            <a href="/docs" className="text-blue-500 hover:underline">
              documentation
            </a>{' '}
            or reach out to our community.
          </p>
        </div>
      </div>
    </div>
  );
}
