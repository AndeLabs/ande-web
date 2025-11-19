import { redirect } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Faucet - ANDE Network',
  description: 'Get free ANDE testnet tokens for development and testing',
};

/**
 * Faucet page redirects to external faucet service
 * The faucet now runs at faucet.ande.network
 */
export default function FaucetPage() {
  redirect('https://faucet.ande.network');
}
