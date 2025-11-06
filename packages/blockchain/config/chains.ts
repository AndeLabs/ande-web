import { defineChain } from 'viem';

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
