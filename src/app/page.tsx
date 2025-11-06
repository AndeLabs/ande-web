import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-1');
  return (
    <div className="flex flex-col">
      <section className="relative w-full h-[60vh] overflow-hidden">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-hero-gradient opacity-80 mix-blend-multiply" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-primary-foreground p-4">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter animate-float">
            The Decentralized Future is ANDE
          </h1>
          <p className="mt-4 max-w-2xl text-xl md:text-2xl">
            A high-performance blockchain for the next generation of decentralized applications.
          </p>
          <div className="mt-8 flex gap-4">
            <Button asChild size="lg">
              <Link href="/dashboard">Launch App</Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/explorer">Explore Network</Link>
            </Button>
          </div>
        </div>
      </section>
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold">Why ANDE Network?</h2>
            <p className="mt-4 max-w-3xl mx-auto text-muted-foreground text-lg">
              ANDE Network combines the best of Web3 technology to provide a scalable, secure, and user-friendly platform for developers and users.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
