'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Bot, TrendingUp, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  { icon: Bot, label: 'AI Automation', desc: 'Intelligent workflows' },
  { icon: TrendingUp, label: '10x ROI Growth', desc: 'Measurable results' },
  { icon: Zap, label: 'Lightning Fast', desc: 'Ship in weeks' },
];

const trustPoints = ['AI-Powered', 'Enterprise Grade', '24/7 Support'];

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
};

export function Hero() {
  return (
    <section className="relative min-h-[100vh] overflow-hidden pt-24">
      <div className="absolute inset-0 bg-hero-mesh" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35] dark:opacity-[0.2]"
        style={{
          backgroundImage:
            'linear-gradient(hsl(var(--border) / 0.4) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border) / 0.4) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          maskImage: 'radial-gradient(ellipse 80% 70% at 50% 40%, black 20%, transparent 75%)',
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-6rem)] max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid w-full items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 xl:gap-20">
          {/* Copy */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-xl text-center lg:mx-0 lg:max-w-none lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-brand/20 bg-brand/[0.07] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-700 dark:text-brand-300"
            >
              <Sparkles className="h-3.5 w-3.5 shrink-0 text-brand-600 dark:text-brand-400" />
              Where Technology Meets Trust
            </motion.div>

            <h1 className="font-display text-[2.65rem] font-bold leading-[1.08] tracking-[-0.03em] text-foreground sm:text-5xl lg:text-[3.35rem] xl:text-[3.75rem]">
              <span className="block">Transform Your</span>
              <span className="block">Business</span>
              <span className="mt-1 block text-gradient-shimmer">With AI</span>
            </h1>

            <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg lg:mx-0 lg:max-w-lg">
              We build AI automations, high-converting websites, and performance marketing systems
              that help businesses scale faster.
            </p>

            <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/contact">
                  Book Consultation
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
                <Link href="/services">Explore Services</Link>
              </Button>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55, duration: 0.6 }}
              className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 lg:justify-start"
            >
              {trustPoints.map((item) => (
                <span key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="h-1 w-1 rounded-full bg-brand" />
                  {item}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-md lg:max-w-none"
          >
            <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-brand/15 via-transparent to-accent/10 blur-3xl" />

            <div className="relative">
              <div className="absolute left-1/2 top-1/2 -z-10 h-[88%] w-[88%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-border/50" />
              <div className="absolute left-1/2 top-1/2 -z-10 h-[72%] w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/15" />

              <div className="glass-premium relative mx-auto flex aspect-square max-h-[340px] w-full max-w-[340px] items-center justify-center rounded-[2rem] p-8 sm:max-h-[380px] sm:max-w-[380px]">
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  className="logo-backdrop p-4 sm:p-5"
                >
                  <Image
                    src="/techloom-logo.png"
                    alt="Techloom"
                    width={220}
                    height={220}
                    priority
                    className="logo-image h-32 w-auto sm:h-40"
                  />
                </motion.div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {features.map((feature, i) => (
                  <motion.div
                    key={feature.label}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 + i * 0.1, duration: 0.5 }}
                    className="glass-premium rounded-2xl p-4"
                  >
                    <div className="icon-3d mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white">
                      <feature.icon className="h-4 w-4" />
                    </div>
                    <p className="text-sm font-semibold leading-tight text-foreground">{feature.label}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{feature.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}