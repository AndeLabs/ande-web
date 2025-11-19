'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Droplet, Search } from 'lucide-react';
import Link from 'next/link';

/**
 * Services Section Component
 * Displays quick access cards to Explorer and Faucet
 */

const SERVICES = [
  {
    title: 'Block Explorer',
    description: 'View transactions, blocks, and smart contracts on AndeChain',
    icon: Search,
    href: 'https://explorer.ande.network',
    buttonText: 'View Explorer',
    external: true,
    features: [
      'Real-time transaction tracking',
      'Block details and validators',
      'Smart contract verification',
      'Address analytics'
    ]
  },
  {
    title: 'Testnet Faucet',
    description: 'Get free ANDE tokens for testing and development on testnet',
    icon: Droplet,
    href: 'https://faucet.ande.network',
    buttonText: 'Request Tokens',
    external: true,
    features: [
      '100 ANDE per request',
      '24-hour cooldown',
      'No prerequisites',
      'Instant delivery'
    ]
  },
];

export function ServicesSection() {
  return (
    <section className="py-16 md:py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">
            Essential Tools & Services
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-muted-foreground text-lg">
            Access the tools you need to explore, test, and develop on AndeChain
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {SERVICES.map((service) => {
            const Icon = service.icon;
            return (
              <Card
                key={service.title}
                className="flex flex-col hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 text-primary p-3 rounded-lg">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{service.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {service.description}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-muted-foreground mb-3">
                      Features:
                    </p>
                    <ul className="space-y-2">
                      {service.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6">
                    {service.external ? (
                      <Button asChild className="w-full" variant="default">
                        <a
                          href={service.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2"
                        >
                          {service.buttonText}
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    ) : (
                      <Button asChild className="w-full" variant="default">
                        <Link href={service.href}>
                          {service.buttonText}
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-12 p-6 bg-primary/5 border border-primary/20 rounded-lg max-w-2xl mx-auto">
          <h3 className="font-semibold mb-2">Need RPC Endpoint?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Use the public RPC endpoint to connect your wallet and interact with AndeChain:
          </p>
          <code className="block bg-background p-3 rounded text-xs font-mono mb-4 break-all">
            https://rpc.ande.network
          </code>
          <p className="text-xs text-muted-foreground">
            Add this to your wallet settings under Custom Networks to start using AndeChain
          </p>
        </div>
      </div>
    </section>
  );
}
