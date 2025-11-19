'use client';

import { ConnectButton as RainbowKitConnectButton } from '@rainbow-me/rainbowkit';
import { Button } from '@/components/ui/button';
import { Wallet, ChevronDown, AlertTriangle, Copy, ExternalLink, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

/**
 * Custom Connect Button for ANDE Network
 * Features:
 * - Custom styling matching ANDE brand
 * - Network switching support
 * - Copy address functionality
 * - Explorer link
 */
export function ConnectButton() {
  const { toast } = useToast();

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast({
      title: 'Address Copied',
      description: 'Wallet address copied to clipboard',
    });
  };

  return (
    <RainbowKitConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === 'authenticated');

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button
                    onClick={openConnectModal}
                    className="shadow-glow-orange"
                  >
                    <Wallet className="mr-2 h-4 w-4" />
                    Connect Wallet
                  </Button>
                );
              }

              if (chain.unsupported) {
                return (
                  <Button
                    onClick={openChainModal}
                    variant="destructive"
                  >
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Wrong Network
                  </Button>
                );
              }

              return (
                <div className="flex items-center gap-2">
                  {/* Chain Button */}
                  <Button
                    onClick={openChainModal}
                    variant="outline"
                    size="sm"
                    className="hidden sm:flex"
                  >
                    {chain.hasIcon && chain.iconUrl && (
                      <img
                        alt={chain.name ?? 'Chain icon'}
                        src={chain.iconUrl}
                        className="w-4 h-4 mr-2 rounded-full"
                      />
                    )}
                    {chain.name}
                    <ChevronDown className="ml-1 h-3 w-3" />
                  </Button>

                  {/* Account Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <div className="flex items-center gap-2">
                          {account.displayBalance && (
                            <span className="hidden sm:inline font-mono text-xs">
                              {account.displayBalance}
                            </span>
                          )}
                          <span className="font-mono">
                            {account.displayName}
                          </span>
                          <ChevronDown className="h-3 w-3" />
                        </div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem
                        onClick={() => copyAddress(account.address)}
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Address
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <a
                          href={`https://explorer.ande.network/address/${account.address}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View on Explorer
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={openAccountModal}
                        className="text-destructive focus:text-destructive"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Disconnect
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              );
            })()}
          </div>
        );
      }}
    </RainbowKitConnectButton.Custom>
  );
}

/**
 * Simple Connect Button (uses RainbowKit default)
 * Use this for simple integration without custom styling
 */
export function SimpleConnectButton() {
  return <RainbowKitConnectButton />;
}
