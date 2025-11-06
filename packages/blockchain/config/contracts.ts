import { getAndeChain } from './chains';

/**
 * TESTNET DEPLOYMENT ADDRESSES (2025-11-06)
 * Chain ID: 6174
 * RPC: https://rpc.ande.network
 * 
 * All addresses are TESTNET ONLY
 * Update when mainnet deployment is ready
 */

// TIER 1: Core Token Contract
export const ANDETokenDualityAddress = '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707' as const;

// TIER 1: Staking Contract
export const AndeNativeStakingAddress = '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853' as const;

// TIER 1: Sequencer Registry
export const AndeSequencerRegistryAddress = '0x610178dA211FEF7D417bC0e6FeD39F05609AD788' as const;

// TIER 2: Governance - Timelock Controller
export const AndeTimelockControllerAddress = '0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82' as const;

// TIER 2: Governance - Governor (Pending Deployment)
// Update this address once AndeGovernor is deployed
export const AndeGovernorAddress = process.env.NEXT_PUBLIC_GOVERNOR_ADDRESS || ('0x0000000000000000000000000000000000000000' as const);

/**
 * Contract Configuration Object
 * ABIs are fetched from the blockchain at runtime for security and reliability
 * 
 * Each contract entry includes:
 * - address: Deployed contract address
 * - chain: Network configuration
 * - category: TIER 1 (Core) or TIER 2 (Governance)
 */
export const contractAddresses = {
  andeToken: {
    address: ANDETokenDualityAddress,
    chain: getAndeChain(),
    category: 'TIER_1_CORE',
    name: 'ANDETokenDuality',
  },
  andeStaking: {
    address: AndeNativeStakingAddress,
    chain: getAndeChain(),
    category: 'TIER_1_CORE',
    name: 'AndeNativeStaking',
  },
  andeSequencer: {
    address: AndeSequencerRegistryAddress,
    chain: getAndeChain(),
    category: 'TIER_1_CORE',
    name: 'AndeSequencerRegistry',
  },
  andeTimelock: {
    address: AndeTimelockControllerAddress,
    chain: getAndeChain(),
    category: 'TIER_2_GOVERNANCE',
    name: 'AndeTimelockController',
  },
  andeGovernor: {
    address: AndeGovernorAddress,
    chain: getAndeChain(),
    category: 'TIER_2_GOVERNANCE',
    name: 'AndeGovernor',
  },
} as const;

/**
 * Type-safe contract addresses
 */
export type ContractKey = keyof typeof contractAddresses;
export type ContractAddress = (typeof contractAddresses)[ContractKey];
