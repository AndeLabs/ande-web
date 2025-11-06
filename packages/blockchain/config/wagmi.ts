
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { andeNetwork } from './chains';
import { metaMask } from 'wagmi/connectors';

export const wagmiConfig = getDefaultConfig({
  appName: 'ANDE Network',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  chains: [andeNetwork],
  ssr: true,
  connectors: [
    metaMask,
  ],
});
