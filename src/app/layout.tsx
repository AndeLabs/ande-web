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
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { NetworkStatusBanner } from '@/components/network-status-banner';
import { StructuredData } from '@/components/structured-data';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  metadataBase: new URL('https://ande.network'),
  title: {
    default: 'ANDE Network - The Sovereign Rollup for Latin America',
    template: '%s | ANDE Network',
  },
  description: 'ANDE Network is a fast, cheap, and truly sovereign EVM rollup built for Latin America, using Celestia for Data Availability. Experience sub-second transactions with minimal fees.',
  keywords: [
    'blockchain',
    'layer 2',
    'rollup',
    'sovereign rollup',
    'Celestia',
    'Data Availability',
    'Latin America',
    'EVM',
    'DeFi',
    'staking',
    'testnet',
    'ANDE',
  ],
  authors: [{ name: 'ANDE Labs' }],
  creator: 'ANDE Labs',
  publisher: 'ANDE Labs',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ande.network',
    siteName: 'ANDE Network',
    title: 'ANDE Network - The Sovereign Rollup for Latin America',
    description: 'Fast, cheap, and truly sovereign EVM rollup built for Latin America. Experience the future of blockchain.',
    images: [
      {
        url: placeholderImages.abstractNetwork.og,
        width: 1200,
        height: 630,
        alt: 'ANDE Network - Sovereign Rollup',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ANDE Network - The Sovereign Rollup for Latin America',
    description: 'Fast, cheap, and truly sovereign EVM rollup built for Latin America',
    images: [placeholderImages.abstractNetwork.og],
    creator: '@ANDENetwork',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <StructuredData />
      </head>
      <body
        className={cn(
          'font-body antialiased min-h-screen bg-background text-foreground',
          inter.variable
        )}
      >
        <Providers>
          <div className="relative flex min-h-dvh flex-col">
            <Header />
            <NetworkStatusBanner />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
          <Analytics />
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  );
}
