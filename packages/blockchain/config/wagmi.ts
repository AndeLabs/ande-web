
import { createConfig, http } from 'wagmi';
import { andeNetwork } from './chains';
import { metaMask, walletConnect } from 'wagmi/connectors';
import type {Connector} from 'wagmi';

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

const connectors: Connector[] = [
  metaMask(),
];

if (projectId) {
  connectors.push(walletConnect({ projectId }));
} else {
    console.warn('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set, WalletConnect will not be available.');
}

export const wagmiConfig = createConfig({
  chains: [andeNetwork],
  connectors,
  transports: {
    [andeNetwork.id]: http(),
  },
  ssr: true,
});
