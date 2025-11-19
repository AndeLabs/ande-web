import { Metadata } from 'next';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Code,
  Server,
  Database,
  Zap,
  ExternalLink,
  Copy,
  Terminal,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'API Reference | ANDE Documentation',
  description: 'Complete JSON-RPC API reference for ANDE Network - endpoints, methods, and examples.',
};

const endpoints = [
  {
    name: 'Mainnet RPC',
    url: 'https://rpc.ande.network',
    description: 'Primary JSON-RPC endpoint',
  },
  {
    name: 'WebSocket',
    url: 'wss://rpc.ande.network/ws',
    description: 'WebSocket for subscriptions',
  },
  {
    name: 'Explorer API',
    url: 'https://explorer.ande.network/api/v2',
    description: 'Blockscout REST API',
  },
];

const rpcMethods = [
  {
    category: 'Block Methods',
    methods: [
      {
        name: 'eth_blockNumber',
        description: 'Returns the current block number',
        params: 'None',
        example: `curl -X POST https://rpc.ande.network \\
  -H "Content-Type: application/json" \\
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'`,
      },
      {
        name: 'eth_getBlockByNumber',
        description: 'Returns block information by number',
        params: 'blockNumber (hex), fullTransactions (boolean)',
        example: `curl -X POST https://rpc.ande.network \\
  -H "Content-Type: application/json" \\
  -d '{"jsonrpc":"2.0","method":"eth_getBlockByNumber","params":["latest", false],"id":1}'`,
      },
      {
        name: 'eth_getBlockByHash',
        description: 'Returns block information by hash',
        params: 'blockHash, fullTransactions (boolean)',
        example: `curl -X POST https://rpc.ande.network \\
  -H "Content-Type: application/json" \\
  -d '{"jsonrpc":"2.0","method":"eth_getBlockByHash","params":["0x...", false],"id":1}'`,
      },
    ],
  },
  {
    category: 'Transaction Methods',
    methods: [
      {
        name: 'eth_sendRawTransaction',
        description: 'Submits a signed transaction',
        params: 'signedTransaction (hex)',
        example: `curl -X POST https://rpc.ande.network \\
  -H "Content-Type: application/json" \\
  -d '{"jsonrpc":"2.0","method":"eth_sendRawTransaction","params":["0x..."],"id":1}'`,
      },
      {
        name: 'eth_getTransactionByHash',
        description: 'Returns transaction details by hash',
        params: 'transactionHash',
        example: `curl -X POST https://rpc.ande.network \\
  -H "Content-Type: application/json" \\
  -d '{"jsonrpc":"2.0","method":"eth_getTransactionByHash","params":["0x..."],"id":1}'`,
      },
      {
        name: 'eth_getTransactionReceipt',
        description: 'Returns transaction receipt by hash',
        params: 'transactionHash',
        example: `curl -X POST https://rpc.ande.network \\
  -H "Content-Type: application/json" \\
  -d '{"jsonrpc":"2.0","method":"eth_getTransactionReceipt","params":["0x..."],"id":1}'`,
      },
    ],
  },
  {
    category: 'Account Methods',
    methods: [
      {
        name: 'eth_getBalance',
        description: 'Returns account balance in wei',
        params: 'address, blockNumber',
        example: `curl -X POST https://rpc.ande.network \\
  -H "Content-Type: application/json" \\
  -d '{"jsonrpc":"2.0","method":"eth_getBalance","params":["0x...", "latest"],"id":1}'`,
      },
      {
        name: 'eth_getTransactionCount',
        description: 'Returns the nonce for an address',
        params: 'address, blockNumber',
        example: `curl -X POST https://rpc.ande.network \\
  -H "Content-Type: application/json" \\
  -d '{"jsonrpc":"2.0","method":"eth_getTransactionCount","params":["0x...", "latest"],"id":1}'`,
      },
      {
        name: 'eth_getCode',
        description: 'Returns contract bytecode at address',
        params: 'address, blockNumber',
        example: `curl -X POST https://rpc.ande.network \\
  -H "Content-Type: application/json" \\
  -d '{"jsonrpc":"2.0","method":"eth_getCode","params":["0x...", "latest"],"id":1}'`,
      },
    ],
  },
  {
    category: 'Contract Methods',
    methods: [
      {
        name: 'eth_call',
        description: 'Executes a call without creating a transaction',
        params: 'callObject, blockNumber',
        example: `curl -X POST https://rpc.ande.network \\
  -H "Content-Type: application/json" \\
  -d '{"jsonrpc":"2.0","method":"eth_call","params":[{"to":"0x...","data":"0x..."},"latest"],"id":1}'`,
      },
      {
        name: 'eth_estimateGas',
        description: 'Estimates gas needed for a transaction',
        params: 'callObject',
        example: `curl -X POST https://rpc.ande.network \\
  -H "Content-Type: application/json" \\
  -d '{"jsonrpc":"2.0","method":"eth_estimateGas","params":[{"to":"0x...","data":"0x..."}],"id":1}'`,
      },
      {
        name: 'eth_getLogs',
        description: 'Returns logs matching filter criteria',
        params: 'filterObject',
        example: `curl -X POST https://rpc.ande.network \\
  -H "Content-Type: application/json" \\
  -d '{"jsonrpc":"2.0","method":"eth_getLogs","params":[{"fromBlock":"0x1","toBlock":"latest","address":"0x..."}],"id":1}'`,
      },
    ],
  },
  {
    category: 'Chain Methods',
    methods: [
      {
        name: 'eth_chainId',
        description: 'Returns the chain ID (6174 = 0x181E)',
        params: 'None',
        example: `curl -X POST https://rpc.ande.network \\
  -H "Content-Type: application/json" \\
  -d '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}'`,
      },
      {
        name: 'eth_gasPrice',
        description: 'Returns the current gas price',
        params: 'None',
        example: `curl -X POST https://rpc.ande.network \\
  -H "Content-Type: application/json" \\
  -d '{"jsonrpc":"2.0","method":"eth_gasPrice","params":[],"id":1}'`,
      },
      {
        name: 'net_version',
        description: 'Returns the network ID',
        params: 'None',
        example: `curl -X POST https://rpc.ande.network \\
  -H "Content-Type: application/json" \\
  -d '{"jsonrpc":"2.0","method":"net_version","params":[],"id":1}'`,
      },
    ],
  },
];

const explorerEndpoints = [
  {
    method: 'GET',
    path: '/stats',
    description: 'Network statistics',
  },
  {
    method: 'GET',
    path: '/main-page/blocks',
    description: 'Recent blocks',
  },
  {
    method: 'GET',
    path: '/main-page/transactions',
    description: 'Recent transactions',
  },
  {
    method: 'GET',
    path: '/addresses/:hash',
    description: 'Address details',
  },
  {
    method: 'GET',
    path: '/addresses/:hash/transactions',
    description: 'Address transactions',
  },
  {
    method: 'GET',
    path: '/transactions/:hash',
    description: 'Transaction details',
  },
  {
    method: 'GET',
    path: '/blocks/:number',
    description: 'Block details',
  },
  {
    method: 'GET',
    path: '/smart-contracts/:hash',
    description: 'Contract info & ABI',
  },
];

export default function ApiPage() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-5xl">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <Badge className="mb-4" variant="secondary">
          API Reference
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          ANDE API
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Complete JSON-RPC API reference for interacting with ANDE Network.
          Standard Ethereum JSON-RPC with ANDE-specific extensions.
        </p>
      </section>

      {/* Endpoints */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Endpoints</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {endpoints.map((endpoint) => (
            <Card key={endpoint.name}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{endpoint.name}</CardTitle>
                <CardDescription>{endpoint.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <code className="text-xs bg-muted px-2 py-1 rounded break-all">
                  {endpoint.url}
                </code>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Rate Limits */}
      <section className="mb-16">
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Zap className="h-5 w-5" />
              Rate Limits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Public RPC</span>
                <span className="font-mono">100 requests/minute</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">WebSocket</span>
                <span className="font-mono">50 subscriptions/connection</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Explorer API</span>
                <span className="font-mono">60 requests/minute</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Need higher limits? Run your own node or contact us for enterprise access.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* JSON-RPC Methods */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">JSON-RPC Methods</h2>
        <div className="space-y-8">
          {rpcMethods.map((category) => (
            <div key={category.category}>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Code className="h-5 w-5" />
                {category.category}
              </h3>
              <div className="space-y-4">
                {category.methods.map((method) => (
                  <Card key={method.name}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-mono">
                        {method.name}
                      </CardTitle>
                      <CardDescription>{method.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Parameters:</p>
                          <p className="text-sm">{method.params}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Example:</p>
                          <pre className="bg-muted rounded-lg p-3 overflow-x-auto text-xs">
                            <code>{method.example}</code>
                          </pre>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Explorer API */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Explorer REST API</h2>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Blockscout API v2
            </CardTitle>
            <CardDescription>
              Base URL: https://explorer.ande.network/api/v2
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {explorerEndpoints.map((endpoint, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-3 bg-muted rounded-lg"
                >
                  <Badge variant={endpoint.method === 'GET' ? 'secondary' : 'default'}>
                    {endpoint.method}
                  </Badge>
                  <code className="text-sm flex-1">{endpoint.path}</code>
                  <span className="text-sm text-muted-foreground hidden md:block">
                    {endpoint.description}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" asChild>
                <a href="https://explorer.ande.network/api-docs" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Full API Documentation
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* WebSocket Subscriptions */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">WebSocket Subscriptions</h2>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Server className="h-5 w-5" />
              Real-time Updates
            </CardTitle>
            <CardDescription>
              Subscribe to blockchain events via WebSocket
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <pre className="bg-muted rounded-lg p-4 overflow-x-auto text-sm">
                <code>{`// Subscribe to new blocks
const ws = new WebSocket('wss://rpc.ande.network/ws');

ws.send(JSON.stringify({
  jsonrpc: '2.0',
  method: 'eth_subscribe',
  params: ['newHeads'],
  id: 1
}));

// Subscribe to pending transactions
ws.send(JSON.stringify({
  jsonrpc: '2.0',
  method: 'eth_subscribe',
  params: ['newPendingTransactions'],
  id: 2
}));

// Subscribe to logs
ws.send(JSON.stringify({
  jsonrpc: '2.0',
  method: 'eth_subscribe',
  params: ['logs', { address: '0x...' }],
  id: 3
}));`}</code>
              </pre>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Error Codes */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Error Codes</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-muted rounded-lg">
                <code className="text-sm">-32700</code>
                <span className="text-sm text-muted-foreground">Parse error</span>
              </div>
              <div className="flex justify-between p-3 bg-muted rounded-lg">
                <code className="text-sm">-32600</code>
                <span className="text-sm text-muted-foreground">Invalid request</span>
              </div>
              <div className="flex justify-between p-3 bg-muted rounded-lg">
                <code className="text-sm">-32601</code>
                <span className="text-sm text-muted-foreground">Method not found</span>
              </div>
              <div className="flex justify-between p-3 bg-muted rounded-lg">
                <code className="text-sm">-32602</code>
                <span className="text-sm text-muted-foreground">Invalid params</span>
              </div>
              <div className="flex justify-between p-3 bg-muted rounded-lg">
                <code className="text-sm">-32603</code>
                <span className="text-sm text-muted-foreground">Internal error</span>
              </div>
              <div className="flex justify-between p-3 bg-muted rounded-lg">
                <code className="text-sm">-32000</code>
                <span className="text-sm text-muted-foreground">Server error</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
