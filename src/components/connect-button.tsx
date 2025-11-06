'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatAddress } from 'packages/blockchain/utils/formatters';
import { ChevronDown, LogOut } from 'lucide-react';
import Link from 'next/link';

export function ConnectButton() {
  const { address, isConnected, connector } = useAccount();
  const { disconnect } = useDisconnect();
  const { connectors, connect } = useConnect();

  if (isConnected && address) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <Avatar className="w-6 h-6 mr-2">
              <AvatarImage
                src={`https://effigy.im/a/${address}.svg`}
                alt="Wallet Avatar"
              />
              <AvatarFallback>{address.slice(2, 4)}</AvatarFallback>
            </Avatar>
            {formatAddress(address)}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>
            {connector?.name}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => disconnect()}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Disconnect</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>Connect Wallet</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {connectors.map((c) => (
          <DropdownMenuItem key={c.uid} onClick={() => connect({ connector: c })}>
            {c.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
