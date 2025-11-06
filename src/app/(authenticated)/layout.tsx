'use client';

import { ReactNode, useState } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AppSidebar } from '@/components/app/sidebar';
import { AppHeader } from '@/components/app/header';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { AIAssistant } from '@/components/app/ai-assistant';

export default function AuthenticatedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { isConnected, isConnecting } = useAccount();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!isConnecting && !isConnected) {
      router.push('/connect');
    }
  }, [isConnected, isConnecting, router]);

  if (isConnecting || !isConnected) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner className="h-12 w-12" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <AppSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className={`flex flex-1 flex-col transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
        <AppHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-muted/40">
            {children}
        </main>
        <AIAssistant />
      </div>
    </div>
  );
}
