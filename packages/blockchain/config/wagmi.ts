import { createConfig, http } from 'wagmi';
import { andeNetwork } from './chains';
import { metaMask, walletConnect, coinbaseWallet } from 'wagmi/connectors';

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

if (!projectId) {
  throw new Error('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set');
}

export const wagmiConfig = createConfig({
  chains: [andeNetwork],
  connectors: [
    walletConnect({ projectId }),
    metaMask(),
    coinbaseWallet({ appName: 'ANDE Network Platform' }),
  ],
  transports: {
    [andeNetwork.id]: http(),
  },
  ssr: true,
});
