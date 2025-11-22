'use client';

import { WagmiProvider, cookieToInitialState } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { wagmiConfig } from 'packages/blockchain/config/wagmi';

/**
 * Custom RainbowKit theme matching ANDE brand colors
 */
const andeTheme = darkTheme({
  accentColor: '#FF9F1C', // ANDE Orange
  accentColorForeground: '#ffffff',
  borderRadius: 'medium',
  fontStack: 'system',
  overlayBlur: 'small',
});

interface ProvidersProps {
  children: ReactNode;
  cookie: string | null;
}

/**
 * Providers component wrapping the app with Wagmi, RainbowKit, and React Query
 * Uses cookieStorage for SSR compatibility
 * QueryClient created once using useState to prevent hydration errors
 */
export function Providers({ children, cookie }: ProvidersProps) {
  // Create queryClient once and reuse - prevents hydration mismatches
  const [queryClient] = useState(
    () => new QueryClient({
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
    })
  );

  // Convert cookie string to initial state on client side
  const initialState = cookie ? cookieToInitialState(wagmiConfig, cookie) : undefined;

  return (
    <WagmiProvider config={wagmiConfig} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={andeTheme}
          modalSize="compact"
          appInfo={{
            appName: 'ANDE Network',
            learnMoreUrl: 'https://ande.network/docs',
          }}
          showRecentTransactions={true}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
