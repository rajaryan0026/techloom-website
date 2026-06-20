'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface Stat {
  key: string;
  value: string;
  label: string;
}

function AnimatedValue({ value }: { value: string }) {
  const numeric = parseInt(value.replace(/\D/g, ''));
  const suffix = value.replace(/[\d]/g, '');
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView || isNaN(numeric)) return;
    let start = 0;
    const duration = 2000;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setCount(Math.floor(progress * numeric));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, numeric]);

  if (isNaN(numeric)) return <span ref={ref}>{value}</span>;
  return <span ref={ref}>{count}{suffix}</span>;
}

export function StatsCounter({ stats }: { stats: Stat[] }) {
  return (
    <section className="relative py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="glass-premium rounded-3xl p-8 sm:p-12">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative text-center"
              >
                {i > 0 && (
                  <div className="absolute -left-4 top-1/2 hidden h-12 w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-white/10 to-transparent md:block" />
                )}
                <div className="font-display text-4xl font-bold text-gradient-shimmer sm:text-5xl">
                  <AnimatedValue value={stat.value} />
                </div>
                <p className="mt-2 text-sm font-medium uppercase tracking-wider text-surface-gray">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}