import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'ANDE Network - The Sovereign Rollup for Latin America',
  description: 'ANDE Network is a fast, cheap, and truly sovereign EVM rollup built for Latin America, using Celestia for Data Availability.',
  openGraph: {
    title: 'ANDE Network - The Sovereign Rollup for Latin America',
    description: 'A high-performance blockchain for the next generation of decentralized applications.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1690029670479-9fee2fa120eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxhYnN0cmFjdCUyMG5ldHdvcmt8ZW58MHx8fHwxNzYyNDI3NTg0fDA&ixlib=rb-4.1.0&q=80&w=1200',
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn(
          'font-body antialiased min-h-screen bg-background text-foreground'
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
