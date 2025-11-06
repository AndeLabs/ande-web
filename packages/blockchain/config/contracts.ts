import { andeNetwork } from './chains';

export const ANDETokenDualityAddress = '0x00000000000000000000000000000000000000FD' as const;

export const andeTokenDualityABI = [
  {
    "constant": true,
    "inputs": [{"name": "_owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "balance", "type": "uint256"}],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [{"name": "_to", "type": "address"}, {"name": "_value", "type": "uint256"}],
    "name": "transfer",
    "outputs": [{"name": "", "type": "bool"}],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [{"name": "_spender", "type": "address"}, {"name": "_value", "type": "uint256"}],
    "name": "approve",
    "outputs": [{"name": "", "type": "bool"}],
    "type": "function"
  }
] as const;

export const andeNativeStakingAddress = '0xTBD_AndeNativeStaking' as const;

export const andeNativeStakingABI = [
    {
        "inputs": [
            { "internalType": "uint256", "name": "amount", "type": "uint256" },
            { "internalType": "uint8", "name": "poolId", "type": "uint8" }
        ],
        "name": "stake",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "uint256", "name": "amount", "type": "uint256" },
            { "internalType": "uint8", "name": "poolId", "type": "uint8" }
        ],
        "name": "unstake",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint8", "name": "poolId", "type": "uint8" }],
        "name": "claimRewards",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "user", "type": "address" },
            { "internalType": "uint8", "name": "poolId", "type": "uint8" }
        ],
        "name": "getStakedAmount",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    }
] as const;


export const andeGovernorAddress = '0xTBD_AndeGovernor' as const;

export const andeGovernorABI = [
    {
        "inputs": [
            { "internalType": "address[]", "name": "targets", "type": "address[]" },
            { "internalType": "uint256[]", "name": "values", "type": "uint256[]" },
            { "internalType": "bytes[]", "name": "calldatas", "type": "bytes[]" },
            { "internalType": "string", "name": "description", "type": "string" }
        ],
        "name": "propose",
        "outputs": [{ "internalType": "uint256", "name": "proposalId", "type": "uint256" }],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "uint256", "name": "proposalId", "type": "uint256" },
            { "internalType": "uint8", "name": "support", "type": "uint8" }
        ],
        "name": "vote",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address[]", "name": "targets", "type": "address[]" },
            { "internalType": "uint256[]", "name": "values", "type": "uint256[]" },
            { "internalType": "bytes[]", "name": "calldatas", "type": "bytes[]" },
            { "internalType": "bytes32", "name": "descriptionHash", "type": "bytes32" }
        ],
        "name": "execute",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    }
] as const;

export const contracts = {
    andeTokenDuality: {
        address: ANDETokenDualityAddress,
        abi: andeTokenDualityABI,
        chain: andeNetwork,
    },
    andeNativeStaking: {
        address: andeNativeStakingAddress,
        abi: andeNativeStakingABI,
        chain: andeNetwork,
    },
    andeGovernor: {
        address: andeGovernorAddress,
        abi: andeGovernorABI,
        chain: andeNetwork,
    },
};
