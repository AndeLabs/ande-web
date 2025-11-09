
import { createConfig, http } from 'wagmi';
import { andeNetwork } from './chains';
import { metaMask } from 'wagmi/connectors';
import { QueryClient } from '@tanstack/react-query';
import { createPublicClient } from 'viem';

if (!process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID) {
  console.warn(
    'NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set. WalletConnect will not be available.'
  );
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5000, // 5 seconds
      refetchOnWindowFocus: true,
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

export const publicClient = createPublicClient({
  chain: andeNetwork,
  transport: http('https://rpc.ande.network')
})
