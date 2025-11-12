import { HeroSection } from '@/components/homepage/hero-section';
import { NetworkStatsLive } from '@/components/homepage/network-stats-live';
import { FeaturesSection } from '@/components/homepage/features-section';
import { DeveloperQuickstart } from '@/components/homepage/developer-quickstart';
import { ServicesSection } from '@/components/services-section';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Rocket, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <HeroSection />

      {/* Live Network Stats */}
      <NetworkStatsLive />

      {/* Features */}
      <FeaturesSection />

      {/* Developer Quickstart */}
      <DeveloperQuickstart />

      {/* Services */}
      <ServicesSection />

      {/* Final CTA */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-background to-background/50">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-6">
              <Rocket className="h-4 w-4" />
              Join the ANDE Ecosystem
            </div>

            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              Ready to Build the Future?
            </h2>

            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Join developers across Latin America building the next generation
              of decentralized applications on ANDE Network.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8 py-6 shadow-glow-orange">
                <Link href="/dashboard">
                  Launch App
                  <ArrowRight className="ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
                <Link href="/docs">Explore Documentation</Link>
              </Button>
            </div>

            {/* Community Links */}
            <div className="mt-12 flex flex-wrap gap-6 items-center justify-center text-sm text-muted-foreground">
              <Link
                href="https://twitter.com/ANDENetwork"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                Twitter
              </Link>
              <span>•</span>
              <Link
                href="https://discord.gg/ande"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                Discord
              </Link>
              <span>•</span>
              <Link
                href="https://github.com/ANDELabs"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                GitHub
              </Link>
              <span>•</span>
              <Link href="/blog" className="hover:text-primary transition-colors">
                Blog
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
