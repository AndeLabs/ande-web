'use client';

import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DarkModeToggle } from './dark-mode-toggle';
import { QuickAccessServices } from './quick-access-services';

const mainNavLinks = [
  { href: '/about', label: 'About' },
  { href: '/technology', label: 'Technology' },
  { href: '/tokenomics', label: 'Tokenomics' },
  { href: '/roadmap', label: 'Roadmap' },
  { href: '/team', label: 'Team' },
  { href: '/docs', label: 'Docs' },
  { href: '/blog', label: 'Blog' },
];

const appNavLinks = [
    { href: "/dashboard", label: "Dashboard"},
    { href: "https://explorer.ande.network", label: "Explorer", external: true },
    { href: "https://faucet.ande.network", label: "Faucet", external: true },
    { href: "/stats", label: "Stats"},
]

export function Header() {
  const pathname = usePathname();
  const isApp = pathname.startsWith('/dashboard') || pathname.startsWith('/portfolio') || pathname.startsWith('/staking') || pathname.startsWith('/governance') || pathname.startsWith('/defi') || pathname.startsWith('/transactions') || pathname.startsWith('/profile');

  // This is a temporary solution to distinguish between the two apps.
  // In a real monorepo, these would be separate applications.
  if (isApp) {
    return null; // The authenticated layout will have its own header
  }

  const navLinks = isApp ? appNavLinks : mainNavLinks;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link className="mr-6 flex items-center space-x-2" href="/">
            <Logo />
            <span className="hidden font-bold sm:inline-block">
              ANDE Network
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navLinks.map(link => (
              <Link
                key={link.href}
                className="transition-colors text-foreground/60 hover:text-foreground/80"
                href={link.href}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button className="md:hidden" size="icon" variant="ghost">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <Link className="mr-6 flex items-center space-x-2" href="/">
              <Logo />
              <span className="font-bold">ANDE Network</span>
            </Link>
            <div className="mt-6 flex flex-col space-y-4">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  className="transition-colors text-foreground/60 hover:text-foreground/80"
                  href={link.href}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex flex-1 items-center justify-end space-x-2">
          <QuickAccessServices />
          <DarkModeToggle />
          <Button asChild>
            <Link href="/dashboard">Launch App</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
