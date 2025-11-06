import { Logo } from '@/components/logo';

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto flex flex-col items-center justify-center gap-4 py-8 text-center md:flex-row md:justify-between">
        <div className="flex items-center gap-2">
          <Logo />
          <span className="font-bold">ANDE Network</span>
        </div>
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} ANDE Network. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
