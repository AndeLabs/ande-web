import { createConfig, http } from 'wagmi';
import { andeNetwork, getAndeChain } from './chains';
import { metaMask, walletConnect, coinbaseWallet, injected } from 'wagmi/connectors';
import { QueryClient } from '@tanstack/react-query';

/**
 * WalletConnect Project ID
 * Get yours at https://cloud.walletconnect.com
 */
const WALLETCONNECT_PROJECT_ID = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

if (!WALLETCONNECT_PROJECT_ID) {
  console.warn(
    '[ANDE] NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID not set. WalletConnect disabled.'
  );
}

/**
 * React Query Client Configuration
 * Optimized for blockchain data with aggressive caching
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      gcTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: 1,
    },
  },
});

/**
 * ANDE Network Metadata for WalletConnect
 */
const andeMetadata = {
  name: 'ANDE Network',
  description: 'The Sovereign Rollup for Latin America',
  url: 'https://ande.network',
  icons: ['https://ande.network/logoofical.png'],
};

/**
 * Wallet Connectors Configuration
 */
const connectors = [
  // Injected wallets (browser extensions)
  injected({
    shimDisconnect: true,
  }),

  // MetaMask
  metaMask({
    dappMetadata: andeMetadata,
  }),

  // Coinbase Wallet
  coinbaseWallet({
    appName: andeMetadata.name,
    appLogoUrl: andeMetadata.icons[0],
  }),

  // WalletConnect (if project ID available)
  ...(WALLETCONNECT_PROJECT_ID ? [
    walletConnect({
      projectId: WALLETCONNECT_PROJECT_ID,
      metadata: andeMetadata,
      showQrModal: true,
    }),
  ] : []),
];

/**
 * Get the active chain based on environment
 */
const activeChain = getAndeChain();

/**
 * Wagmi Configuration
 * Full-featured config with multiple wallet support
 */
export const wagmiConfig = createConfig({
  chains: [activeChain],
  connectors,
  transports: {
    [activeChain.id]: http(activeChain.rpcUrls.default.http[0], {
      batch: {
        batchSize: 1024,
        wait: 16, // ms - batch requests within 16ms
      },
      retryCount: 3,
      retryDelay: 1000,
      timeout: 20000,
    }),
  },
  ssr: true,
  // Multichain support ready for future
  // Uncomment when adding more chains
  // multiInjectedProviderDiscovery: true,
});

/**
 * Export active chain for use in components
 */
export { activeChain as andeChain };
