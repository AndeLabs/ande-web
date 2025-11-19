'use client';

import { Logo } from '@/components/logo';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Github, Twitter, MessageSquare } from 'lucide-react';

const socialLinks = [
  { name: 'Twitter', href: '#', icon: Twitter },
  { name: 'Github', href: '#', icon: Github },
  { name: 'Discord', href: '#', icon: MessageSquare },
];

export function Footer() {
  const pathname = usePathname();
  const isApp = pathname.startsWith('/dashboard') || pathname.startsWith('/portfolio') || pathname.startsWith('/staking') || pathname.startsWith('/governance') || pathname.startsWith('/defi') || pathname.startsWith('/transactions') || pathname.startsWith('/profile');

  if (isApp) {
    return null;
  }

  return (
    <footer className="border-t">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
        <div>
          <div className="flex items-center gap-2">
            <Logo />
            <span className="font-bold text-lg">ANDE Network</span>
          </div>
          <p className="mt-4 text-muted-foreground">
            The Sovereign Rollup for Latin America.
          </p>
        </div>
        <div>
          <h3 className="font-semibold">Resources</h3>
          <ul className="mt-4 space-y-2">
            <li><Link href="/docs" className="text-muted-foreground hover:text-foreground">Documentation</Link></li>
            <li><Link href="/blog" className="text-muted-foreground hover:text-foreground">Blog</Link></li>
            <li><Link href="/about" className="text-muted-foreground hover:text-foreground">About Us</Link></li>
            <li><a href="https://explorer.ande.network" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">Block Explorer</a></li>
            <li><a href="https://faucet.ande.network" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">Testnet Faucet</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold">Community</h3>
          <div className="flex mt-4 space-x-4">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                className="text-muted-foreground hover:text-foreground"
              >
                <social.icon className="h-6 w-6" />
                <span className="sr-only">{social.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 py-8 text-center md:flex-row">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} ANDE Network. All rights reserved.
            </p>
            <div className="flex space-x-4 text-sm text-muted-foreground">
                <Link href="#" className="hover:text-foreground">Privacy Policy</Link>
                <Link href="#" className="hover:text-foreground">Terms of Service</Link>
            </div>
        </div>
      </div>
    </footer>
  );
}
