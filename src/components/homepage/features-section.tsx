'use client';

import { Globe, Zap, Droplets, Lock, Code, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { motion } from 'framer-motion';
import Image from 'next/image';

const features = [
  {
    icon: Globe,
    title: 'Truly Sovereign',
    description:
      'No L1 dependency, providing complete autonomy and censorship resistance for Latin America.',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description:
      'Experience rapid finality with 5-second block times and sub-second transaction confirmation.',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
  },
  {
    icon: Droplets,
    title: 'Ultra Low Fees',
    description:
      'Gas fees as low as $0.0001 thanks to Celestia for Data Availability. Build without breaking the bank.',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  {
    icon: Lock,
    title: 'Battle-Tested Security',
    description:
      "Fully EVM compatible, inheriting Ethereum's proven security model with additional sovereign safeguards.",
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  {
    icon: Code,
    title: 'Developer Friendly',
    description:
      'Use your existing Ethereum tools. Deploy with Hardhat, Foundry, Remix - everything just works.',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
  },
  {
    icon: Shield,
    title: 'Decentralized Security',
    description:
      'Powered by a decentralized sequencer network and Celestia DA layer for maximum censorship resistance.',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function FeaturesSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Built for the Next Generation
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            ANDE Network combines the best of blockchain technology to create a
            platform that's fast, affordable, and truly decentralized.
          </p>
        </motion.div>

        {/* Character Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-12"
        >
          <Image
            src="/images/brand/andeusandotecnologia.png"
            alt="ANDE using technology"
            width={300}
            height={300}
            className="opacity-90"
          />
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div key={feature.title} variants={item}>
                <Card className="h-full bg-card/50 backdrop-blur-sm border-white/10 hover:border-primary/50 transition-all hover:shadow-glow-blue group">
                  <CardHeader>
                    <div
                      className={`${feature.bgColor} ${feature.color} p-3 rounded-lg w-fit group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="h-8 w-8" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
