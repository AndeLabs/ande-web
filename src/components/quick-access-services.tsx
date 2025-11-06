'use client';

import { ExternalLink } from 'lucide-react';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

/**
 * Quick Access Services Component
 * Provides quick links to Explorer and Faucet
 */

const SERVICES = [
  {
    name: 'Block Explorer',
    href: 'https://explorer.ande.network',
    description: 'View transactions and blocks',
    external: true,
  },
  {
    name: 'Faucet',
    href: '/faucet',
    description: 'Get testnet ANDE tokens',
    external: false,
  },
];

export function QuickAccessServices() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="text-sm">
          Services ↓
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Quick Access</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {SERVICES.map((service) => (
          <DropdownMenuItem key={service.href} asChild>
            {service.external ? (
              <a
                href={service.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between cursor-pointer"
              >
                <div className="flex flex-col">
                  <span className="font-medium">{service.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {service.description}
                  </span>
                </div>
                <ExternalLink className="h-4 w-4 flex-shrink-0 ml-2" />
              </a>
            ) : (
              <Link
                href={service.href}
                className="flex items-center justify-between w-full"
              >
                <div className="flex flex-col">
                  <span className="font-medium">{service.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {service.description}
                  </span>
                </div>
              </Link>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
