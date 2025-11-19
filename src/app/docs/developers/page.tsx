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
  FileCode,
  Terminal,
  Coins,
  Shield,
  Zap,
  ExternalLink,
  ArrowRight,
  GitBranch,
  Package,
  TestTube,
  Rocket,
} from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Developer Guide | ANDE Documentation',
  description: 'In-depth developer guide for building on ANDE Network - smart contracts, Token Duality integration, and best practices.',
};

const contractAddresses = [
  {
    name: 'ANDETokenDuality',
    address: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
    description: 'ERC-20 interface for native ANDE token',
  },
  {
    name: 'NativeStaking',
    address: '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853',
    description: 'Multi-pool staking contract',
  },
  {
    name: 'SequencerRegistry',
    address: '0x61010e4bDD5D7c0e3ea87C159b420E8fe1952788',
    description: 'Validator/sequencer management',
  },
  {
    name: 'TimelockController',
    address: '0x0DCd1Bf9A1b36cE34237eEaFef220932846BF31F3',
    description: 'Governance timelock',
  },
];

const devTools = [
  {
    icon: Terminal,
    name: 'Foundry',
    description: 'Recommended toolkit for smart contract development',
    install: 'curl -L https://foundry.paradigm.xyz | bash && foundryup',
    link: 'https://book.getfoundry.sh/',
  },
  {
    icon: Package,
    name: 'Hardhat',
    description: 'Popular JavaScript-based development environment',
    install: 'npm install --save-dev hardhat',
    link: 'https://hardhat.org/',
  },
  {
    icon: Code,
    name: 'Remix IDE',
    description: 'Browser-based Solidity IDE for quick prototyping',
    install: 'No installation needed',
    link: 'https://remix.ethereum.org/',
  },
];

export default function DevelopersPage() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-5xl">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <Badge className="mb-4" variant="secondary">
          Developer Guide
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Build on ANDE
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Deploy smart contracts, integrate Token Duality, and build the next
          generation of decentralized applications on ANDE Network.
        </p>
      </section>

      {/* Quick Facts */}
      <section className="mb-16">
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-2xl font-bold">6174</p>
              <p className="text-sm text-muted-foreground">Chain ID</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-2xl font-bold">^0.8.20</p>
              <p className="text-sm text-muted-foreground">Solidity Version</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-2xl font-bold">36M</p>
              <p className="text-sm text-muted-foreground">Block Gas Limit</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-2xl font-bold">~5s</p>
              <p className="text-sm text-muted-foreground">Block Time</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Development Tools */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Development Tools</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {devTools.map((tool) => (
            <Card key={tool.name}>
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <tool.icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">{tool.name}</CardTitle>
                <CardDescription>{tool.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <code className="text-xs bg-muted px-2 py-1 rounded block overflow-x-auto mb-4">
                  {tool.install}
                </code>
                <Button variant="outline" size="sm" asChild>
                  <a href={tool.link} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-3 w-3" />
                    Documentation
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Token Duality */}
      <section className="mb-16">
        <Card className="bg-gradient-to-br from-primary/5 to-brand-orange/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5" />
              Token Duality Integration
            </CardTitle>
            <CardDescription>
              Precompile address: 0x00000000000000000000000000000000000000FD
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-sm text-muted-foreground">
              ANDE's unique Token Duality precompile allows the native gas token to function
              as an ERC-20 simultaneously. This enables seamless DeFi integration without
              wrapped tokens.
            </p>

            <div>
              <h4 className="font-semibold mb-3">Using Token Duality in Your Contracts</h4>
              <pre className="bg-background rounded-lg p-4 overflow-x-auto text-sm">
                <code>{`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MyDeFiProtocol {
    // Token Duality precompile address
    address constant ANDE_TOKEN = 0x00000000000000000000000000000000000000FD;

    // Use ANDE as ERC-20 in your protocol
    function depositANDE(uint256 amount) external {
        // Transfer ANDE as ERC-20
        IERC20(ANDE_TOKEN).transferFrom(msg.sender, address(this), amount);

        // Your deposit logic here
    }

    function withdrawANDE(uint256 amount) external {
        // Transfer ANDE back to user
        IERC20(ANDE_TOKEN).transfer(msg.sender, amount);
    }

    // Check ANDE balance (same as native balance)
    function checkBalance(address user) external view returns (uint256) {
        return IERC20(ANDE_TOKEN).balanceOf(user);
    }
}`}</code>
              </pre>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Key Features</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Zap className="h-4 w-4 text-primary mt-0.5" />
                  <span>Full ERC-20 interface (transfer, approve, transferFrom)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="h-4 w-4 text-primary mt-0.5" />
                  <span>Balance equals native ETH balance - no syncing needed</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="h-4 w-4 text-primary mt-0.5" />
                  <span>Works with existing DeFi protocols (Uniswap, Aave, etc.)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="h-4 w-4 text-primary mt-0.5" />
                  <span>No wrapping/unwrapping overhead</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Contract Deployment */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Deploying Contracts</h2>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Terminal className="h-5 w-5" />
                Using Foundry
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted rounded-lg p-4 overflow-x-auto text-sm">
                <code>{`# Create new project
forge init my-ande-project
cd my-ande-project

# Configure foundry.toml
[profile.default]
src = "src"
out = "out"
libs = ["lib"]
solc = "0.8.20"

[rpc_endpoints]
ande = "https://rpc.ande.network"

# Write your contract in src/MyContract.sol

# Deploy to ANDE Network
forge create src/MyContract.sol:MyContract \\
  --rpc-url https://rpc.ande.network \\
  --private-key $PRIVATE_KEY \\
  --verify \\
  --verifier blockscout \\
  --verifier-url https://explorer.ande.network/api

# Verify existing contract
forge verify-contract $CONTRACT_ADDRESS \\
  src/MyContract.sol:MyContract \\
  --chain-id 6174 \\
  --verifier blockscout \\
  --verifier-url https://explorer.ande.network/api`}</code>
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TestTube className="h-5 w-5" />
                Testing Your Contracts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted rounded-lg p-4 overflow-x-auto text-sm">
                <code>{`// test/MyContract.t.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/MyContract.sol";

contract MyContractTest is Test {
    MyContract public myContract;

    function setUp() public {
        myContract = new MyContract();
    }

    function testExample() public {
        // Your test logic
        assertEq(myContract.value(), 0);
    }

    // Fork test against ANDE network
    function testFork() public {
        // Create fork of ANDE
        vm.createSelectFork("https://rpc.ande.network");

        // Test against live state
        // ...
    }
}

// Run tests
// forge test -vvv`}</code>
              </pre>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contract Addresses */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Core Contract Addresses</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {contractAddresses.map((contract) => (
                <div
                  key={contract.name}
                  className="p-4 bg-muted rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">{contract.name}</span>
                    <Button variant="ghost" size="sm" asChild>
                      <a
                        href={`https://explorer.ande.network/address/${contract.address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                  <code className="text-xs break-all">{contract.address}</code>
                  <p className="text-xs text-muted-foreground mt-1">{contract.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Best Practices */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Best Practices</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="h-5 w-5" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Use checks-effects-interactions pattern</li>
                <li>• Implement reentrancy guards for external calls</li>
                <li>• Validate all inputs thoroughly</li>
                <li>• Use OpenZeppelin's audited contracts</li>
                <li>• Get audited before mainnet deployment</li>
                <li>• Implement pausable functionality for emergencies</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Zap className="h-5 w-5" />
                Gas Optimization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Pack storage variables efficiently</li>
                <li>• Use events instead of storage for history</li>
                <li>• Prefer calldata over memory for read-only</li>
                <li>• Cache array length in loops</li>
                <li>• Use custom errors instead of require strings</li>
                <li>• Batch operations when possible</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Resources */}
      <section>
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="py-8">
            <div className="text-center mb-6">
              <Rocket className="h-12 w-12 mx-auto mb-4 opacity-80" />
              <h2 className="text-2xl font-bold mb-2">Ready to Build?</h2>
              <p className="opacity-90">Get started with these resources</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button variant="secondary" asChild>
                <a href="https://github.com/AndeLabs/ande-chain" target="_blank" rel="noopener noreferrer">
                  <GitBranch className="mr-2 h-4 w-4" />
                  GitHub
                </a>
              </Button>
              <Button variant="secondary" asChild>
                <a href="https://faucet.ande.network" target="_blank" rel="noopener noreferrer">
                  <Coins className="mr-2 h-4 w-4" />
                  Faucet
                </a>
              </Button>
              <Button variant="secondary" asChild>
                <a href="https://explorer.ande.network" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Explorer
                </a>
              </Button>
              <Button variant="secondary" asChild>
                <Link href="/docs/api">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  API Docs
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
