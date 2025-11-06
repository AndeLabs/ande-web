
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { andeNetwork } from './chains';
import { metaMask } from 'wagmi/connectors';

if (!process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID) {
  console.warn(
    'NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set. WalletConnect will not be available.'
  );
}

export const wagmiConfig = getDefaultConfig({
  appName: 'ANDE Network',
  // Providing a fallback projectId to prevent RainbowKit from throwing an error.
  // WalletConnect will simply not work without a valid ID.
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '00000000000000000000000000000000',
  chains: [andeNetwork],
  ssr: true,
  connectors: [
    metaMask,
  ],
});
