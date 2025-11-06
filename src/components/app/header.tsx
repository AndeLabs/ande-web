'use client';

import { Bell, Menu, Network } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConnectButton } from '@/components/connect-button';
import { DarkModeToggle } from '@/components/dark-mode-toggle';
import { Badge } from '../ui/badge';

interface AppHeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export function AppHeader({ sidebarOpen, setSidebarOpen }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle Sidebar</span>
      </Button>

      <div className="flex-1" />

      <div className="flex items-center gap-4">
        <Badge variant="outline" className="hidden sm:flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span>Ande Network</span>
        </Badge>
        <DarkModeToggle />
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
        <ConnectButton />
      </div>
    </header>
  );
}
