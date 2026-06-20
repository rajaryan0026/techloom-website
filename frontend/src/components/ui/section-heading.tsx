'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  title: string;
  accent?: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeading({ title, accent, subtitle, align = 'center', className }: SectionHeadingProps) {
  const accentWord = accent ?? title.split(' ').slice(-1)[0];
  const baseTitle = accent ? title.replace(accent, '').trim() : title.replace(accentWord, '').trim();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={cn('mb-16', align === 'center' && 'text-center', className)}
    >
      <div className={cn('inline-flex flex-col', align === 'center' && 'items-center')}>
        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-brand-700 dark:text-brand-300">
          <span className="h-1.5 w-1.5 rounded-full bg-brand" />
          Techloom
        </span>
        <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          {baseTitle}{baseTitle ? ' ' : ''}
          <span className="text-gradient-shimmer">{accentWord}</span>
        </h2>
        {subtitle && (
          <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">{subtitle}</p>
        )}
        <div className="mt-6 h-px w-24 bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>
    </motion.div>
  );
}