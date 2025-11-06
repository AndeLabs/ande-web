import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import { ConnectButton } from '@/components/connect-button';
import { DarkModeToggle } from './dark-mode-toggle';

const navLinks = [
  { href: '/about', label: 'About' },
  { href: '/technology', label: 'Technology' },
  { href: '/tokenomics', label: 'Tokenomics' },
  { href: '/roadmap', label: 'Roadmap' },
  { href: '/team', label: 'Team' },
  { href: '/docs', label: 'Docs' },
  { href: '/blog', label: 'Blog' },
];

export function Header() {
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
          <DarkModeToggle />
          <Button asChild>
            <a href="https://app.ande.network" target="_blank" rel="noopener noreferrer">Launch App</a>
          </Button>
        </div>
      </div>
    </header>
  );
}
