import { NextResponse } from 'next/server';
import { createPublicClient, http } from 'viem';
import { andeNetwork } from '../../../../packages/blockchain/config/chains';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface HealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  checks: {
    rpc: {
      status: 'ok' | 'error';
      latency?: number;
      error?: string;
    };
    blockHeight: {
      status: 'ok' | 'error';
      blockNumber?: string;
      error?: string;
    };
    gasPrice: {
      status: 'ok' | 'error';
      gasPrice?: string;
      error?: string;
    };
  };
  uptime: boolean;
}

export async function GET() {
  const startTime = Date.now();
  const checks: HealthCheck['checks'] = {
    rpc: { status: 'ok' },
    blockHeight: { status: 'ok' },
    gasPrice: { status: 'ok' },
  };

  try {
    // Create a public client to interact with the ANDE network
    const publicClient = createPublicClient({
      chain: andeNetwork,
      transport: http('https://rpc.ande.network', {
        timeout: 5000,
      }),
    });

    // Check RPC connectivity
    try {
      const blockNumber = await publicClient.getBlockNumber();
      const rpcLatency = Date.now() - startTime;

      checks.rpc = {
        status: 'ok',
        latency: rpcLatency,
      };

      checks.blockHeight = {
        status: 'ok',
        blockNumber: blockNumber.toString(),
      };
    } catch (error) {
      checks.rpc = {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
      checks.blockHeight = {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }

    // Check gas price
    try {
      const gasPrice = await publicClient.getGasPrice();
      checks.gasPrice = {
        status: 'ok',
        gasPrice: (Number(gasPrice) / 1e9).toFixed(4) + ' Gwei',
      };
    } catch (error) {
      checks.gasPrice = {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }

    // Determine overall status
    const allOk = Object.values(checks).every((check) => check.status === 'ok');
    const anyError = Object.values(checks).some((check) => check.status === 'error');

    const healthStatus: HealthCheck = {
      status: allOk ? 'healthy' : anyError ? 'unhealthy' : 'degraded',
      timestamp: new Date().toISOString(),
      checks,
      uptime: allOk,
    };

    return NextResponse.json(healthStatus, {
      status: allOk ? 200 : 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        checks,
        uptime: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      {
        status: 503,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      }
    );
  }
}
