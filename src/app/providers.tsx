'use client';

import { WagmiProvider } from 'wagmi';
import { QueryClientProvider } from '@tanstack/react-query';
import { wagmiConfig, queryClient } from 'packages/blockchain/config/wagmi';
import { ReactNode } from 'react';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';

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

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
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
