'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Code, Terminal, Rocket, Book } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export function DeveloperQuickstart() {
  const codeExample = `// Connect to ANDE Network
const provider = new ethers.JsonRpcProvider(
  'https://rpc.ande.network'
);

// Deploy your contract
const contract = await factory.deploy();
await contract.waitForDeployment();

console.log('Deployed to:', contract.target);`;

  const steps = [
    {
      icon: Terminal,
      title: 'Install Dependencies',
      command: 'npm install ethers',
      description: 'Use your favorite Ethereum tools',
    },
    {
      icon: Code,
      title: 'Connect to ANDE',
      command: 'https://rpc.ande.network',
      description: 'Add ANDE RPC to your project',
    },
    {
      icon: Rocket,
      title: 'Deploy & Build',
      command: 'npx hardhat run deploy.js',
      description: 'Deploy contracts like on Ethereum',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-background/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Start Building in Minutes
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            ANDE is fully EVM compatible. Use the same tools you already know
            and love.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-start max-w-6xl mx-auto">
          {/* Code Example */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-slate-950 border-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm font-mono">
                  <Code className="h-4 w-4" />
                  deploy.js
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-sm overflow-x-auto">
                  <code className="language-javascript text-slate-300">
                    {codeExample}
                  </code>
                </pre>
              </CardContent>
            </Card>

            <div className="mt-6 flex flex-wrap gap-4">
              <Button asChild size="lg" className="shadow-glow-orange">
                <Link href="/docs/getting-started">
                  <Book className="mr-2 h-5 w-5" />
                  Getting Started Guide
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/faucet">Get Testnet Tokens</Link>
              </Button>
            </div>
          </motion.div>

          {/* Quick Steps */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-4"
          >
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <Card
                  key={step.title}
                  className="bg-card/50 backdrop-blur-sm border-white/10 hover:border-primary/30 transition-colors"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 text-primary p-3 rounded-lg">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-1 rounded">
                            Step {index + 1}
                          </span>
                          <h3 className="font-semibold">{step.title}</h3>
                        </div>
                        <code className="text-sm bg-slate-950 text-green-400 px-3 py-1.5 rounded block mb-2 font-mono">
                          {step.command}
                        </code>
                        <p className="text-sm text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </motion.div>
        </div>

        {/* Network Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 max-w-3xl mx-auto"
        >
          <Card className="bg-gradient-to-r from-primary/5 to-purple-500/5 border-primary/20">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Network Information</h3>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Network Name:</span>
                  <p className="font-mono font-semibold">ANDE Network Testnet</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Chain ID:</span>
                  <p className="font-mono font-semibold">6174</p>
                </div>
                <div>
                  <span className="text-muted-foreground">RPC URL:</span>
                  <p className="font-mono font-semibold">
                    https://rpc.ande.network
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Explorer:</span>
                  <p className="font-mono font-semibold">
                    https://explorer.ande.network
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
