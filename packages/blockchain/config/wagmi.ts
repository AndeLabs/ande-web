
import { createConfig, http } from 'wagmi';
import { andeNetwork } from './chains';
import { metaMask } from 'wagmi/connectors';
import { QueryClient } from '@tanstack/react-query';

if (!process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID) {
  console.warn(
    'NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set. WalletConnect will not be available.'
  );
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes - Aggressive caching for blockchain data
      gcTime: 30 * 60 * 1000, // 30 minutes - Keep data in cache longer
      refetchOnWindowFocus: false, // Don't refetch on window focus (manual refresh only)
      refetchOnReconnect: true, // Refetch when internet reconnects
      retry: 3, // Retry failed requests 3 times
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    },
  },
});

export const wagmiConfig = createConfig({
  chains: [andeNetwork],
  connectors: [
    metaMask(),
    // walletConnect({ 
    //   projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '00000000000000000000000000000000',
    //   showQrModal: true 
    // })
  ],
  transports: {
    [andeNetwork.id]: http('https://rpc.ande.network', {
      batch: true,
      retryCount: 3,
      timeout: 10000,
    })
  },
  ssr: true,
});
