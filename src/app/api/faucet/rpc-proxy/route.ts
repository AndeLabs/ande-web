import { NextRequest, NextResponse } from 'next/server'

// Configuración del RPC de ANDE
const ANDE_RPC_URL = 'https://rpc.ande.network'

// CORS Headers
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
}

// Handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: CORS_HEADERS })
}

// Proxy para requests RPC
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Reenviar request al RPC de ANDE
    const response = await fetch(ANDE_RPC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // No incluir Origin header para evitar CORS issues
      },
      body: JSON.stringify(body),
    })
    
    const data = await response.json()
    
    // Retornar response con CORS headers
    return NextResponse.json(data, {
      status: response.status,
      headers: {
        ...CORS_HEADERS,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    })
    
  } catch (error) {
    console.error('RPC Proxy Error:', error)
    return NextResponse.json(
      { error: 'RPC proxy failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { 
        status: 500,
        headers: CORS_HEADERS
      }
    )
  }
}

// GET endpoint para información del proxy
export async function GET() {
  return NextResponse.json({
    message: 'ANDE RPC Proxy - Use POST for JSON-RPC calls',
    rpc: ANDE_RPC_URL,
    methods: ['eth_blockNumber', 'eth_getBalance', 'eth_sendRawTransaction', 'eth_getTransactionReceipt', 'eth_call', 'eth_getLogs', 'eth_getTransactionCount'],
    status: 'active'
  }, {
    headers: CORS_HEADERS
  })
}
```

## 🔄 **Actualización del Faucet Component**

Ahora vamos a actualizar el componente del faucet para usar el proxy:
<tool_call>edit_file
<arg_key>display_description</arg_key>
<arg_value>Actualizar faucet para usar proxy RPC</arg_value>
<arg_key>path</arg_key>
<arg_value>/Users/munay/dev/ande-labs/ande-web/src/components/faucet/simple-faucet.tsx</arg_value>
<arg_key>mode</arg_key>
<arg_value>edit</arg_value>
</tool_call>