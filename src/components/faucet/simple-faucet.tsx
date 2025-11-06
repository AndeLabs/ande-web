'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Loader2, Droplets, Send, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react'
import { useAccount, useSwitchChain, useConnect } from 'wagmi'
import { parseEther, formatEther } from 'viem'

// Configuración del faucet ANDE
const FAUCET_CONFIG = {
  address: '0xAb62b7A7D059d6D90b8021aAbdb8123E089F4E0f',
  claimAmount: parseEther('100'), // 100 ANDE
  cooldownMs: 24 * 60 * 60 * 1000, // 24 horas
  maxClaimsPerDay: 3,
  rpcUrl: 'https://rpc.ande.network',
  explorerUrl: 'https://explorer.ande.network',
  chainId: 6174,
}

interface FaucetResponse {
  success: boolean
  message?: string
  txHash?: string
  error?: string
}

export function SimpleFaucet() {
  const [walletAddress, setWalletAddress] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [balance, setBalance] = useState<string>('0')
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'loading' | null; message: string }>({ type: null, message: '' })
  const [canClaim, setCanClaim] = useState(true)
  const [nextClaimTime, setNextClaimTime] = useState<Date | null>(null)
  
  const { address, isConnected } = useAccount()
  const { switchChain } = useSwitchChain()
  const { connect } = useConnect()

  // Obtener saldo del faucet
  const updateBalance = async () => {
    try {
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
      if (data.result) {
        const balanceWei = BigInt(data.result)
        setBalance(formatEther(balanceWei))
      }
    } catch (error) {
      console.error('Error fetching balance:', error)
    }
  }

  // Verificar estado del claim
  const checkClaimStatus = async (addr: string) => {
    try {
      const response = await fetch(`/api/faucet/status?address=${addr}`)
      const data = await response.json()
      
      if (data.success) {
        setCanClaim(data.canClaim)
        if (!data.canClaim && data.nextClaimAt) {
          setNextClaimTime(new Date(data.nextClaimAt))
        } else {
          setNextClaimTime(null)
        }
      }
    } catch (error) {
      console.error('Error checking claim status:', error)
    }
  }

  // Solicitar tokens
  const requestTokens = async () => {
    const targetAddress = address || walletAddress
    
    if (!targetAddress) {
      setStatus({ type: 'error', message: 'Conecta tu wallet o ingresa una dirección' })
      return
    }

    setIsLoading(true)
    setStatus({ type: 'loading', message: 'Procesando solicitud...' })

    try {
      const response = await fetch('/api/faucet/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: targetAddress }),
      })

      const data: FaucetResponse = await response.json()

      if (data.success) {
        setStatus({ 
          type: 'success', 
          message: `✅ 100 ANDE enviados correctamente` 
        })
        setCanClaim(false)
        setNextClaimTime(new Date(Date.now() + FAUCET_CONFIG.cooldownMs))
        updateBalance()
      } else {
        setStatus({ type: 'error', message: data.error || 'Error al procesar' })
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Error de conexión' })
    } finally {
      setIsLoading(false)
    }
  }

  // Agregar red ANDE
  const addAndeNetwork = async () => {
    try {
      await switchChain({ chainId: FAUCET_CONFIG.chainId })
    } catch (error: any) {
      if (error.code === 4902) {
        try {
          await window.ethereum?.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: `0x${FAUCET_CONFIG.chainId.toString(16)}`,
              chainName: 'ANDE Network',
              rpcUrls: [FAUCET_CONFIG.rpcUrl],
              nativeCurrency: {
                name: 'ANDE',
                symbol: 'ANDE',
                decimals: 18,
              },
              blockExplorerUrls: [FAUCET_CONFIG.explorerUrl],
            }],
          })
        } catch (addError) {
          setStatus({ type: 'error', message: 'Error al agregar red' })
        }
      }
    }
  }

  // Formatear tiempo restante
  const formatTimeRemaining = () => {
    if (!nextClaimTime) return null
    
    const now = Date.now()
    const remaining = nextClaimTime.getTime() - now
    
    if (remaining <= 0) return null
    
    const hours = Math.floor(remaining / (1000 * 60 * 60))
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
    
    return `${hours}h ${minutes}m`
  }

  // Efectos
  useEffect(() => {
    updateBalance()
    const interval = setInterval(updateBalance, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const currentAddress = address || walletAddress
    if (currentAddress) {
      checkClaimStatus(currentAddress)
    }
  }, [address, walletAddress])

  const displayAddress = address || walletAddress

  return (
    <Card className="max-w-2xl mx-auto border-2 border-primary/20">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl">
          <Droplets className="w-8 h-8 text-primary" />
          💰 ANDE Testnet Faucet
        </CardTitle>
        <CardDescription>
          Obtén <Badge variant="secondary">100 ANDE</Badge> para testear en la red ANDE
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Saldo del faucet */}
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Saldo disponible:</span>
            <span className="font-mono text-sm font-bold">
              {parseFloat(balance).toLocaleString(undefined, { maximumFractionDigits: 2 })} ANDE
            </span>
          </div>
        </div>

        {/* Conexión */}
        {!isConnected && (
          <div className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Conecta tu wallet o ingresa una dirección para solicitar tokens
              </AlertDescription>
            </Alert>
            
            <div className="space-y-3">
              <Input
                placeholder="Tu dirección de wallet (0x...)"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                className="font-mono"
              />
              
              <Button
                onClick={addAndeNetwork}
                variant="outline"
                className="w-full"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Agregar red ANDE a MetaMask
              </Button>
            </div>
          </div>
        )}

        {/* Botón de solicitud */}
        <Button
          onClick={requestTokens}
          disabled={!displayAddress || isLoading || !canClaim}
          className="w-full"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Procesando...
            </>
          ) : !canClaim && nextClaimTime ? (
            <>
              <AlertCircle className="w-4 h-4 mr-2" />
              Esperar {formatTimeRemaining()}
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Solicitar 100 ANDE
            </>
          )}
        </Button>

        {/* Estado de la solicitud */}
        {status.type && (
          <Alert variant={status.type === 'error' ? 'destructive' : 'default'}>
            {status.type === 'success' && <CheckCircle className="h-4 w-4" />}
            {status.type === 'error' && <AlertCircle className="h-4 w-4" />}
            {status.type === 'loading' && <Loader2 className="h-4 w-4 animate-spin" />}
            <AlertDescription>{status.message}</AlertDescription>
          </Alert>
        )}

        {/* Información importante */}
        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div>
            <span className="font-medium">Red:</span> ANDE Testnet
          </div>
          <div>
            <span className="font-medium">Chain ID:</span> {FAUCET_CONFIG.chainId}
          </div>
          <div>
            <span className="font-medium">Cooldown:</span> 24 horas
          </div>
          <div>
            <span className="font-medium">Límite diario:</span> {FAUCET_CONFIG.maxClaimsPerDay} solicitudes
          </div>
        </div>

        {/* Dirección del faucet */}
        <div className="bg-muted/30 rounded-lg p-3">
          <p className="text-xs text-muted-foreground mb-1">Dirección del Faucet:</p>
          <p className="font-mono text-xs break-all">
            {FAUCET_CONFIG.address}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}