export const FAUCET_CONFIG = {
  address: '0x57349E2a5625B4563e323C82ac924749Be1d89c',
  privateKey: process.env.FAUCET_PRIVATE_KEY || '',
  rpcUrl: 'https://rpc.ande.network',
  chainId: 6174,
  claimAmount: '100000000000000000000', // 100 ANDE en wei
  gasLimit: 21000,
  gasPrice: '20000000000', // 20 gwei en wei
  cooldownMs: 24 * 60 * 60 * 1000, // 24 horas
  maxClaimsPerDay: 3,
  explorerUrl: 'https://andescan.io',
};
