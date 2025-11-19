'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Github, Book } from 'lucide-react';
import placeholderImages from '@/lib/placeholder-images.json';
import { motion } from 'framer-motion';

export function HeroSection() {
  return (
    <section className="relative w-full h-[90vh] min-h-[700px] overflow-hidden">
      {/* Background Image */}
      <Image
        src={placeholderImages.abstractNetwork.hero}
        alt="Abstract network"
        fill
        priority
        className="object-cover animate-gradient"
        data-ai-hint="abstract network"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="mb-6"
          >
            <Image
              src="/logorealistagrande.png"
              alt="ANDE Network Logo"
              width={120}
              height={120}
              className="mx-auto animate-float"
              priority
            />
          </motion.div>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Testnet Live - Get Free ANDE Tokens
          </motion.div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter bg-gradient-to-r from-orange-400 via-purple-500 to-blue-500 bg-clip-text text-transparent animate-float">
            The Sovereign Rollup
            <br />
            for Latin America
          </h1>

          {/* Subheading */}
          <p className="mt-6 max-w-3xl mx-auto text-xl md:text-2xl text-muted-foreground">
            Fast, cheap, and truly sovereign. Built on Celestia for Data
            Availability, powered by innovation.
          </p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center"
          >
            <Button
              asChild
              size="lg"
              className="text-lg px-8 py-6 shadow-glow-orange group"
            >
              <a href="https://faucet.ande.network" target="_blank" rel="noopener noreferrer">
                Get Testnet Tokens
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
              <Link href="/docs">
                <Book className="mr-2 h-5 w-5" />
                Read the Docs
              </Link>
            </Button>
            <Button asChild variant="ghost" size="lg" className="text-lg px-8 py-6">
              <Link
                href="https://github.com/ANDELabs"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="mr-2 h-5 w-5" />
                GitHub
              </Link>
            </Button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-12 flex flex-wrap gap-8 items-center justify-center text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span>100% Open Source</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-500" />
              <span>EVM Compatible</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-purple-500" />
              <span>Powered by Celestia</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <span className="text-xs uppercase tracking-wider">Scroll to explore</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2"
            >
              <motion.div className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
