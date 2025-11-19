import { defineChain } from 'viem';

/**
 * ANDE Network Chain Configuration
 * Sovereign EVM Rollup for Latin America
 *
 * Chain ID: 6174
 * Native Token: ANDE (18 decimals)
 * Consensus: BFT Multi-Validator
 * DA Layer: Celestia
 */

/**
 * Ande Network - Current Testnet (will become Mainnet)
 * Production-ready network with live contracts
 */
export const andeNetwork = defineChain({
  id: 6174,
  name: 'ANDE Network',
  nativeCurrency: {
    decimals: 18,
    name: 'ANDE',
    symbol: 'ANDE',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.ande.network'],
      webSocket: ['wss://rpc.ande.network'],
    },
    public: {
      http: ['https://rpc.ande.network'],
      webSocket: ['wss://rpc.ande.network'],
    },
  },
  blockExplorers: {
    default: {
      name: 'ANDE Explorer',
      url: 'https://explorer.ande.network',
      apiUrl: 'https://explorer.ande.network/api',
    },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 1,
    },
  },
  testnet: true, // Set to false when mainnet launches
});

/**
 * Local Development Chain
 * For local development with anvil/hardhat
 */
export const andeLocal = defineChain({
  id: 6174,
  name: 'ANDE Local',
  nativeCurrency: {
    decimals: 18,
    name: 'ANDE',
    symbol: 'ANDE',
  },
  rpcUrls: {
    default: {
      http: ['http://192.168.0.8:8545'],
      webSocket: ['ws://192.168.0.8:8545'],
    },
  },
  blockExplorers: {
    default: {
      name: 'ANDE Explorer',
      url: 'https://explorer.ande.network',
    },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 1,
    },
  },
  testnet: true,
});

/**
 * Get the appropriate chain based on environment
 */
export const getAndeChain = () => {
  const env = process.env.NEXT_PUBLIC_CHAIN_ENV;

  if (env === 'local') return andeLocal;
  return andeNetwork; // Default to public network
};

/**
 * Chain configuration constants
 */
export const CHAIN_CONFIG = {
  CHAIN_ID: 6174,
  CHAIN_NAME: 'ANDE Network',
  NATIVE_TOKEN: 'ANDE',
  DECIMALS: 18,
  RPC_URL: 'https://rpc.ande.network',
  WS_URL: 'wss://rpc.ande.network',
  EXPLORER_URL: 'https://explorer.ande.network',
  FAUCET_URL: 'https://faucet.ande.network',
  BLOCK_TIME: 5, // seconds
} as const;

/**
 * Type-safe chain configuration
 */
export type AndeChain = typeof andeNetwork | typeof andeLocal;
