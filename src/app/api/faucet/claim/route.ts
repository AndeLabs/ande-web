import { NextRequest, NextResponse } from 'next/server'
import { ethers } from 'ethers'

// Configuración del faucet
const FAUCET_CONFIG = {
  address: '0x57349E2a5625B4563e323C82ac924749Be1d89c',
  privateKey: process.env.FAUCET_PRIVATE_KEY || '',
  rpcUrl: 'https://rpc.ande.network',
  chainId: 6174,
  claimAmount: ethers.utils.parseEther('100'), // 100 ANDE
  gasLimit: 21000,
  gasPrice: ethers.utils.parseUnits('20', 'gwei'),
  cooldownMs: 24 * 60 * 60 * 1000, // 24 horas
  maxClaimsPerDay: 3,
}

// Almacenamiento en memoria (para testnet)
const claimHistory = new Map<string, {
  lastClaim: number
  dailyClaims: number[]
}>()

// Rate limiting básico por IP
const ipRateLimit = new Map<string, {
  count: number
  lastRequest: number
}>()

// Validar dirección Ethereum
function isValidEthereumAddress(address: string): boolean {
  return ethers.utils.isAddress(address)
}

// Obtener IP del cliente
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const cfConnectingIp = request.headers.get('cf-connecting-ip')
  
  if (forwarded) return forwarded.split(',')[0].trim()
  if (cfConnectingIp) return cfConnectingIp.trim()
  if (realIp) return realIp.trim()
  return 'unknown'
}

// Verificar cooldown
function checkCooldown(address: string): { canClaim: boolean; timeRemaining: number } {
  const history = claimHistory.get(address)
  if (!history) return { canClaim: true, timeRemaining: 0 }
  
  const now = Date.now()
  const timeSinceLastClaim = now - history.lastClaim
  
  if (timeSinceLastClaim < FAUCET_CONFIG.cooldownMs) {
    return {
      canClaim: false,
      timeRemaining: FAUCET_CONFIG.cooldownMs - timeSinceLastClaim
    }
  }
  
  return { canClaim: true, timeRemaining: 0 }
}

// Verificar límite diario
function checkDailyLimit(address: string): { canClaim: boolean; claimCount: number } {
  const history = claimHistory.get(address)
  if (!history) return { canClaim: true, claimCount: 0 }
  
  const now = Date.now()
  const startOfDay = Math.floor(now / (24 * 60 * 60 * 1000)) * (24 * 60 * 60 * 1000)
  const todayClaims = history.dailyClaims.filter(claimTime => claimTime >= startOfDay).length
  
  return {
    canClaim: todayClaims < FAUCET_CONFIG.maxClaimsPerDay,
    claimCount: todayClaims
  }
}

// Verificar rate limiting por IP
function checkIPRateLimit(ip: string): { canClaim: boolean; timeRemaining: number } {
  const now = Date.now()
  const ipData = ipRateLimit.get(ip)
  
  if (!ipData) {
    ipRateLimit.set(ip, { count: 1, lastRequest: now })
    return { canClaim: true, timeRemaining: 0 }
  }
  
  const timeSinceLastRequest = now - ipData.lastRequest
  
  // Máximo 1 request por minuto por IP
  if (timeSinceLastRequest < 60000) {
    return {
      canClaim: false,
      timeRemaining: 60000 - timeSinceLastRequest
    }
  }
  
  // Resetear contador si pasó más de 1 hora
  if (timeSinceLastRequest > 3600000) {
    ipData.count = 0
  }
  
  // Máximo 10 requests por hora por IP
  if (ipData.count >= 10) {
    return {
      canClaim: false,
      timeRemaining: 3600000 - timeSinceLastRequest
    }
  }
  
  ipData.count++
  ipData.lastRequest = now
  
  return { canClaim: true, timeRemaining: 0 }
}

// Actualizar historial de claims
function updateClaimHistory(address: string): void {
  const now = Date.now()
  const history = claimHistory.get(address) || {
    lastClaim: 0,
    dailyClaims: []
  }
  
  history.lastClaim = now
  history.dailyClaims.push(now)
  
  // Limpiar claims antiguos (más de 7 días)
  const weekAgo = now - (7 * 24 * 60 * 60 * 1000)
  history.dailyClaims = history.dailyClaims.filter(claimTime => claimTime > weekAgo)
  
  claimHistory.set(address, history)
}

// Enviar tokens reales con ethers.js
async function sendTokens(toAddress: string): Promise<{ success: boolean; txHash?: string; error?: string }> {
  try {
    if (!FAUCET_CONFIG.privateKey) {
      throw new Error('Private key not configured')
    }
    
    // Crear provider y wallet
    const provider = new ethers.providers.JsonRpcProvider(FAUCET_CONFIG.rpcUrl)
    const wallet = new ethers.Wallet(FAUCET_CONFIG.privateKey, provider)
    
    // Verificar balance del faucet
    const balance = await wallet.getBalance()
    if (balance.lt(FAUCET_CONFIG.claimAmount)) {
      return { 
        success: false, 
        error: `Faucet balance insufficient. Current: ${ethers.utils.formatEther(balance)} ANDE` 
      }
    }
    
    // Obtener nonce
    const nonce = await wallet.getTransactionCount()
    
    // Enviar transacción
    console.log(`Sending ${ethers.utils.formatEther(FAUCET_CONFIG.claimAmount)} ANDE to ${toAddress}`)
    
    const tx = await wallet.sendTransaction({
      to: toAddress,
      value: FAUCET_CONFIG.claimAmount,
      gasLimit: FAUCET_CONFIG.gasLimit,
      gasPrice: FAUCET_CONFIG.gasPrice,
      nonce: nonce,
    })
    
    console.log(`Transaction sent: ${tx.hash}`)
    
    // Esperar confirmación
    const receipt = await tx.wait()
    console.log(`Transaction confirmed in block ${receipt.blockNumber}`)
    
    if (receipt.status === 1) {
      return { 
        success: true, 
        txHash: tx.hash
      }
    } else {
      return { 
        success: false, 
        error: 'Transaction failed on network' 
      }
    }
    
  } catch (error: any) {
    console.error('Error sending tokens:', error)
    
    // Manejar errores específicos de ethers
    if (error.code === 'INSUFFICIENT_FUNDS') {
      return { success: false, error: 'Insufficient funds in faucet wallet' }
    } else if (error.code === 'NETWORK_ERROR') {
      return { success: false, error: 'Network connection error' }
    } else if (error.code === 'REPLACEMENT_UNDERPRICED') {
      return { success: false, error: 'Gas price too low' }
    } else if (error.code === 'NONCE_EXPIRED') {
      return { success: false, error: 'Nonce expired, please try again' }
    } else {
      return { 
        success: false, 
        error: error.message || 'Transaction failed' 
      }
    }
  }
}

// POST endpoint para solicitar tokens
export async function POST(request: NextRequest) {
  try {
    const { address } = await request.json()
    
    // Validar dirección
    if (!address || !isValidEthereumAddress(address)) {
      return NextResponse.json({
        success: false,
        error: 'Dirección Ethereum inválida'
      }, { status: 400 })
    }
    
    // Obtener IP y verificar rate limiting
    const clientIP = getClientIP(request)
    const ipCheck = checkIPRateLimit(clientIP)
    
    if (!ipCheck.canClaim) {
      const minutesRemaining = Math.ceil(ipCheck.timeRemaining / 60000)
      return NextResponse.json({
        success: false,
        error: `Demasiadas solicitudes. Espera ${minutesRemaining} minutos.`
      }, { status: 429 })
    }
    
    // Verificar cooldown
    const cooldownCheck = checkCooldown(address)
    if (!cooldownCheck.canClaim) {
      const hoursRemaining = Math.ceil(cooldownCheck.timeRemaining / (1000 * 60 * 60))
      return NextResponse.json({
        success: false,
        error: `Debes esperar ${hoursRemaining} horas para solicitar nuevamente.`
      }, { status: 429 })
    }
    
    // Verificar límite diario
    const dailyCheck = checkDailyLimit(address)
    if (!dailyCheck.canClaim) {
      return NextResponse.json({
        success: false,
        error: `Has alcanzado el límite de ${FAUCET_CONFIG.maxClaimsPerDay} solicitudes por día.`
      }, { status: 429 })
    }
    
    // Enviar tokens reales
    const sendResult = await sendTokens(address)
    
    if (!sendResult.success) {
      return NextResponse.json({
        success: false,
        error: sendResult.error || 'Error al procesar la transacción'
      }, { status: 500 })
    }
    
    // Actualizar historial
    updateClaimHistory(address)
    
    return NextResponse.json({
      success: true,
      message: 'Tokens enviados correctamente',
      txHash: sendResult.txHash,
      amount: FAUCET_CONFIG.claimAmount.toString()
    })
    
  } catch (error) {
    console.error('Faucet API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 })
  }
}

// GET endpoint para información del faucet
export async function GET() {
  try {
    // Obtener balance actual del faucet
    const provider = new ethers.providers.JsonRpcProvider(FAUCET_CONFIG.rpcUrl)
    const balance = await provider.getBalance(FAUCET_CONFIG.address)
    
    return NextResponse.json({
      success: true,
      faucetAddress: FAUCET_CONFIG.address,
      claimAmount: ethers.utils.formatEther(FAUCET_CONFIG.claimAmount),
      currentBalance: ethers.utils.formatEther(balance),
      cooldownHours: 24,
      maxClaimsPerDay: FAUCET_CONFIG.maxClaimsPerDay,
      network: 'ANDE Testnet',
      chainId: FAUCET_CONFIG.chainId,
      rpcUrl: FAUCET_CONFIG.rpcUrl,
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Error al obtener información del faucet'
    }, { status: 500 })
  }
}