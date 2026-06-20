'use client';

import { motion } from 'framer-motion';
import { Shield, Zap, Target, HeadphonesIcon } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
import { TiltCard } from '@/components/effects/tilt-card';

const reasons = [
  { icon: Zap, title: 'AI-First Approach', desc: 'Every solution is built with cutting-edge AI at its core.' },
  { icon: Target, title: 'Results-Driven', desc: 'We measure success by your ROI, not vanity metrics.' },
  { icon: Shield, title: 'Enterprise Security', desc: 'Bank-grade security with full compliance and audit trails.' },
  { icon: HeadphonesIcon, title: 'Dedicated Support', desc: '24/7 support with a dedicated account manager.' },
];

export function WhyChooseUs() {
  return (
    <section className="relative py-28">
      <div className="absolute inset-0 bg-muted/40" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading title="Why Choose Techloom" accent="Techloom" />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
            >
              <TiltCard intensity={6}>
                <div className="glass-premium h-full rounded-3xl p-8 text-center transition-all duration-500 hover:shadow-glow">
                  <div className="icon-3d mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white">
                    <r.icon className="h-8 w-8" />
                  </div>
                  <h3 className="font-display text-lg font-semibold">{r.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-surface-gray">{r.desc}</p>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}