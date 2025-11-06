// Tipos para Ethers.js v6
declare module 'ethers' {
  export interface TransactionResponse {
    hash: string
    wait(): Promise<TransactionReceipt>
  }
  
  export interface TransactionReceipt {
    status: number
    blockNumber: number
    transactionHash: string
  }
  
  export interface JsonRpcProvider {
    getBalance(address: string): Promise<bigint>
    getTransactionCount(address?: string): Promise<number>
    estimateGas(transaction: TransactionRequest): Promise<bigint>
    getFeeData(): Promise<FeeData>
    getTransactionReceipt(hash: string): Promise<TransactionReceipt | null>
  }
  
  export interface FeeData {
    gasPrice: bigint | null
    maxFeePerGas: bigint | null
    maxPriorityFeePerGas: bigint | null
  }
  
  export interface Wallet {
    sendTransaction(transaction: TransactionRequest): Promise<TransactionResponse>
    getAddress(): Promise<string>
  }
  
  export interface TransactionRequest {
    to?: string
    value?: bigint | string
    gasLimit?: bigint | string
    gasPrice?: bigint | string
    nonce?: number
  }
  
  export class Wallet {
    constructor(privateKey: string, provider: JsonRpcProvider)
    sendTransaction(transaction: TransactionRequest): Promise<TransactionResponse>
    getAddress(): Promise<string>
  }
  
  export class JsonRpcProvider {
    constructor(url: string)
    getBalance(address: string): Promise<bigint>
    getTransactionCount(address?: string): Promise<number>
    estimateGas(transaction: TransactionRequest): Promise<bigint>
    getFeeData(): Promise<FeeData>
    getTransactionReceipt(hash: string): Promise<TransactionReceipt | null>
  }
  
  // Utilidades estáticas
  export function parseEther(ether: string): bigint
  export function formatEther(wei: string | bigint): string
  export function formatUnits(wei: string | bigint, unit: string | number): string
  export function parseUnits(value: string, unit: string | number): bigint
  export function isAddress(address: string): boolean
  export const Wallet: typeof Wallet
  export const JsonRpcProvider: typeof JsonRpcProvider
}