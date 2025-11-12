// Configuración pública del faucet (usada en el cliente)
export const FAUCET_CONFIG = {
  address: '0x57349E2a5625B4563e323C82ac924749Be1d89c',
  rpcUrl: 'https://rpc.ande.network',
  chainId: 6174,
  claimAmount: '100', // 100 ANDE
  cooldownMs: 24 * 60 * 60 * 1000, // 24 horas
  maxClaimsPerDay: 3,
  explorerUrl: 'https://explorer.ande.network',
} as const;

export type FaucetConfig = typeof FAUCET_CONFIG;
