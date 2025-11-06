'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ArrowRightLeft,
  Coins,
  Home,
  PanelLeft,
  TrendingUp,
  User,
  Vote,
  Wallet,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '../logo';
import { cn } from '@/lib/utils';

const sidebarConfig = [
  { label: 'Dashboard', href: '/dashboard', icon: Home },
  { label: 'Portfolio', href: '/portfolio', icon: Wallet },
  { label: 'Staking', href: '/staking', icon: Coins },
  { label: 'Governance', href: '/governance', icon: Vote },
  { label: 'DeFi', href: '/defi', icon: TrendingUp },
  { label: 'Transactions', href: '/transactions', icon: ArrowRightLeft },
  { label: 'Profile', href: '/profile', icon: User },
];

interface AppSidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function AppSidebar({ isOpen, setIsOpen }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity md:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 transform flex-col border-r bg-background transition-transform duration-300 md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent pathname={pathname} />
      </aside>

      {/* Desktop Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 hidden md:flex flex-col border-r bg-background transition-all duration-300 ${
          isOpen ? 'w-64' : 'w-20'
        }`}
      >
        <SidebarContent pathname={pathname} isOpen={isOpen} setIsOpen={setIsOpen}/>
      </aside>
    </>
  );
}


interface SidebarContentProps {
    pathname: string;
    isOpen?: boolean;
    setIsOpen?: (isOpen: boolean) => void;
}

function SidebarContent({ pathname, isOpen, setIsOpen }: SidebarContentProps) {
    const isDesktop = typeof isOpen !== 'undefined';
    return (
      <div className="flex h-full flex-col">
        <div className={`flex h-16 items-center border-b px-6 ${isDesktop && !isOpen ? 'justify-center' : ''}`}>
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <Logo />
            <span className={cn("transition-opacity", isDesktop && !isOpen ? "opacity-0 w-0" : "")}>ANDE</span>
          </Link>
          {isDesktop && setIsOpen && (
            <Button variant="ghost" size="icon" className="ml-auto h-8 w-8" onClick={() => setIsOpen(!isOpen)}>
              <PanelLeft className="h-4 w-4" />
            </Button>
          )}
        </div>
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {sidebarConfig.map(item => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                    pathname.startsWith(item.href) && 'bg-muted text-primary',
                    isDesktop && !isOpen ? 'justify-center' : ''
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className={cn("transition-opacity", isDesktop && !isOpen ? "opacity-0 hidden" : "")}>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    );
  }
