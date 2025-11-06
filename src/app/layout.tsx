import type { Metadata } from 'next';
import './globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Providers } from './providers';
import { Inter } from 'next/font/google';
import placeholderImages from '@/lib/placeholder-images.json';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'ANDE Network - The Sovereign Rollup for Latin America',
  description: 'ANDE Network is a fast, cheap, and truly sovereign EVM rollup built for Latin America, using Celestia for Data Availability.',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'ANDE Network - The Sovereign Rollup for Latin America',
    description: 'A high-performance blockchain for the next generation of decentralized applications.',
    images: [
      {
        url: placeholderImages.abstractNetwork.og,
        width: 1200,
        height: 630,
        alt: 'ANDE Network Abstract Background',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={cn(
          'font-body antialiased min-h-screen bg-background text-foreground',
          inter.variable
        )}
      >
        <Providers>
          <div className="relative flex min-h-dvh flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
