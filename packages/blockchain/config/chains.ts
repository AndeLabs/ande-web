import { defineChain } from 'viem';

/**
 * Ande Network Mainnet Configuration
 * Official production network for Ande ecosystem
 */
export const andeNetwork = defineChain({
  id: 6174,
  name: 'Ande Network',
  nativeCurrency: {
    decimals: 18,
    name: 'ANDE',
    symbol: 'ANDE',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.ande.network'],
      ws: ['wss://rpc.ande.network'],
    },
  },
  blockExplorers: {
    default: { name: 'Ande Explorer', url: 'https://explorer.ande.network' },
  },
  testnet: false,
});

/**
 * Ande Network Testnet Configuration
 * Development and testing environment with production-ready code
 */
export const andeTestnet = defineChain({
  id: 6174,
  name: 'Ande Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'ANDE',
    symbol: 'ANDE',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.ande.network'],
      ws: ['wss://rpc.ande.network'],
    },
  },
  blockExplorers: {
    default: { name: 'Ande Explorer', url: 'https://explorer.ande.network' },
  },
  testnet: true,
});

/**
 * Get the appropriate chain based on environment
 * Uses testnet in development, mainnet in production
 */
export const getAndeChain = () => {
  const isProduction = process.env.NEXT_PUBLIC_CHAIN_ENV === 'production';
  return isProduction ? andeNetwork : andeTestnet;
};

/**
 * Type-safe chain configuration
 */
export type AndeChain = typeof andeNetwork | typeof andeTestnet;
