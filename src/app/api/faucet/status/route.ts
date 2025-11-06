import { NextRequest, NextResponse } from 'next/server'

// Almacenamiento en memoria (compatible con el endpoint de claim)
const claimHistory = new Map<string, {
  lastClaim: number
  dailyClaims: number[]
}>()

// Validar dirección Ethereum
function isValidEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

// GET endpoint para verificar estado de claims
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get('address')
    
    if (!address) {
      return NextResponse.json({
        success: false,
        error: 'Dirección requerida'
      }, { status: 400 })
    }
    
    if (!isValidEthereumAddress(address)) {
      return NextResponse.json({
        success: false,
        error: 'Dirección Ethereum inválida'
      }, { status: 400 })
    }
    
    const history = claimHistory.get(address)
    const now = Date.now()
    const cooldownMs = 24 * 60 * 60 * 1000 // 24 horas
    
    if (!history) {
      return NextResponse.json({
        success: true,
        canClaim: true,
        claimsToday: 0,
        maxClaimsPerDay: 3,
        totalClaims: 0,
        lastClaimAt: null,
        nextClaimAt: null,
        cooldownRemaining: 0
      })
    }
    
    // Verificar cooldown
    const timeSinceLastClaim = now - history.lastClaim
    const canClaimDueToCooldown = timeSinceLastClaim >= cooldownMs
    const cooldownRemaining = canClaimDueToCooldown ? 0 : cooldownMs - timeSinceLastClaim
    
    // Contar claims del día actual
    const startOfDay = Math.floor(now / (24 * 60 * 60 * 1000)) * (24 * 60 * 60 * 1000)
    const todayClaims = history.dailyClaims.filter(claimTime => claimTime >= startOfDay).length
    const canClaimDueToDaily = todayClaims < 3
    
    const canClaim = canClaimDueToCooldown && canClaimDueToDaily
    const nextClaimAt = canClaim ? null : new Date(now + cooldownRemaining)
    
    return NextResponse.json({
      success: true,
      canClaim,
      claimsToday: todayClaims,
      maxClaimsPerDay: 3,
      totalClaims: history.dailyClaims.length,
      lastClaimAt: history.lastClaim ? new Date(history.lastClaim).toISOString() : null,
      nextClaimAt: nextClaimAt ? nextClaimAt.toISOString() : null,
      cooldownRemaining: Math.max(0, cooldownRemaining)
    })
    
  } catch (error) {
    console.error('Status check error:', error)
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 })
  }
}