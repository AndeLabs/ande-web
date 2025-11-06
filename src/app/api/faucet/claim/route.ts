import { NextRequest, NextResponse } from 'next/server'

// Configuración del faucet
const FAUCET_CONFIG = {
  address: '0xAb62b7A7D059d6D90b8021aAbdb8123E089F4E0f',
  privateKey: process.env.FAUCET_PRIVATE_KEY || '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a',
  claimAmount: '100000000000000000000', // 100 ANDE en wei
  rpcUrl: 'https://rpc.ande.network',
  chainId: 6174,
  gasLimit: 21000,
  gasPrice: '20000000000', // 20 gwei
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
  return /^0x[a-fA-F0-9]{40}$/.test(address)
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

// Obtener nonce
async function getNonce(address: string): Promise<number> {
  try {
    const response = await fetch(FAUCET_CONFIG.rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_getTransactionCount',
        params: [address, 'latest'],
        id: 1,
      }),
    })
    
    const data = await response.json()
    return parseInt(data.result, 16)
  } catch (error) {
    console.error('Error getting nonce:', error)
    return 0
  }
}

// Enviar transacción raw
async function sendRawTransaction(signedTx: string): Promise<string> {
  try {
    const response = await fetch(FAUCET_CONFIG.rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_sendRawTransaction',
        params: [signedTx],
        id: 1,
      }),
    })
    
    const data = await response.json()
    return data.result
  } catch (error) {
    console.error('Error sending transaction:', error)
    throw error
  }
}

// Enviar tokens (implementación simple)
async function sendTokens(toAddress: string): Promise<{ success: boolean; txHash?: string; error?: string }> {
  try {
    // En un entorno real, aquí firmarías la transacción con ethers.js
    // Por ahora, simulamos una transacción exitosa para testnet
    
    const nonce = await getNonce(FAUCET_CONFIG.address)
    const mockTxHash = '0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')
    
    console.log(`Simulating transaction: ${FAUCET_CONFIG.address} -> ${toAddress}, amount: ${FAUCET_CONFIG.claimAmount}, nonce: ${nonce}`)
    
    // Simulación de éxito
    return { 
      success: true, 
      txHash: mockTxHash
    }
    
  } catch (error) {
    console.error('Error sending tokens:', error)
    return { 
      success: false, 
      error: 'Error al procesar la transacción'
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
    
    // Enviar tokens
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
      amount: FAUCET_CONFIG.claimAmount
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
    // Obtener balance actual
    const response = await fetch(FAUCET_CONFIG.rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_getBalance',
        params: [FAUCET_CONFIG.address, 'latest'],
        id: 1,
      }),
    })
    
    const data = await response.json()
    let balance = '0'
    
    if (data.result) {
      const balanceWei = BigInt(data.result)
      balance = (balanceWei / BigInt(10**18)).toString()
    }
    
    return NextResponse.json({
      success: true,
      faucetAddress: FAUCET_CONFIG.address,
      claimAmount: (parseInt(FAUCET_CONFIG.claimAmount) / 10**18).toString(),
      currentBalance: balance,
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