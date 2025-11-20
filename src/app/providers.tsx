'use client';

import { WagmiProvider } from 'wagmi';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactNode, useState, useEffect } from 'react';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import type { Config } from 'wagmi';

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
  const [mounted, setMounted] = useState(false);
  const [wagmiConfig, setWagmiConfig] = useState<Config | null>(null);
  const [queryClient, setQueryClient] = useState<QueryClient | null>(null);

  useEffect(() => {
    // Dynamically import wagmi config to avoid SSR localStorage issues
    import('packages/blockchain/config/wagmi').then((module) => {
      setWagmiConfig(module.wagmiConfig);
      setQueryClient(module.queryClient);
      setMounted(true);
    });
  }, []);

  // Show nothing until wagmi config is loaded (prevents SSR issues)
  if (!mounted || !wagmiConfig || !queryClient) {
    return null;
  }

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
