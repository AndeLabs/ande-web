'use client';

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http, cookieStorage, createStorage } from 'wagmi';
import { getAndeChain } from './chains';
import {
  // Popular wallets
  metaMaskWallet,
  coinbaseWallet,
  walletConnectWallet,
  rainbowWallet,
  trustWallet,
  // Hardware wallets
  ledgerWallet,
  // Mobile wallets
  argentWallet,
  omniWallet,
  imTokenWallet,
  // Exchange wallets
  okxWallet,
  bitgetWallet,
  binanceWallet,
  krakenWallet,
  // Other popular wallets
  phantomWallet,
  rabbyWallet,
  safeWallet,
  zerionWallet,
  // Browser wallets
  braveWallet,
  frameWallet,
  // Generic fallbacks
  injectedWallet,
} from '@rainbow-me/rainbowkit/wallets';

/**
 * WalletConnect Project ID
 * Get yours at https://cloud.walletconnect.com
 */
const WALLETCONNECT_PROJECT_ID = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

if (!WALLETCONNECT_PROJECT_ID) {
  console.warn(
    '[ANDE] NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID not set. WalletConnect may have limited functionality.'
  );
}

/**
 * Get the active chain based on environment
 */
const activeChain = getAndeChain();

/**
 * Custom wallet groups for comprehensive wallet support
 * WalletConnect enables 500+ additional wallets via QR code
 */
const wallets = [
  {
    groupName: 'Popular',
    wallets: [
      metaMaskWallet,
      coinbaseWallet,
      rainbowWallet,
      trustWallet,
      walletConnectWallet, // Supports 500+ wallets via QR code
    ],
  },
  {
    groupName: 'Exchange Wallets',
    wallets: [
      okxWallet,
      binanceWallet,
      bitgetWallet,
      krakenWallet,
    ],
  },
  {
    groupName: 'More Wallets',
    wallets: [
      phantomWallet,
      rabbyWallet,
      zerionWallet,
      argentWallet,
      braveWallet,
      ledgerWallet,
      safeWallet,
      frameWallet,
      omniWallet,
      imTokenWallet,
      injectedWallet, // Fallback for any injected wallet
    ],
  },
];

/**
 * Wagmi Configuration using RainbowKit's getDefaultConfig
 * Created at module level for SSR compatibility
 * Uses cookieStorage to persist state between server and client
 */
export const wagmiConfig = getDefaultConfig({
  appName: 'ANDE Network',
  projectId: WALLETCONNECT_PROJECT_ID || '2efb73dd51eeb4d4867c9626ec632e7e',
  chains: [activeChain],
  wallets,
  ssr: true, // Enable SSR support for Next.js
  storage: createStorage({
    storage: cookieStorage,
  }),
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
});

/**
 * Export active chain for use in components
 */
export { activeChain as andeChain };
