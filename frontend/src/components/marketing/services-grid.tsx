'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Bot, TrendingUp, Globe, GraduationCap, ArrowRight } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
import { TiltCard } from '@/components/effects/tilt-card';
import type { Service } from '@/types';

const iconMap: Record<string, React.ElementType> = {
  Bot, TrendingUp, Globe, GraduationCap,
};

export function ServicesGrid({
  services,
  showHeading = true,
}: {
  services: Service[];
  showHeading?: boolean;
}) {
  return (
    <section className="relative py-28">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand/[0.03] to-transparent" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {showHeading && (
          <SectionHeading
            title="Our Services"
            accent="Services"
            subtitle="End-to-end solutions powered by cutting-edge AI"
          />
        )}

        <div className="grid gap-8 md:grid-cols-2">
          {services.map((service, i) => {
            const Icon = iconMap[service.icon || ''] || Bot;
            const features = Array.isArray(service.features) ? service.features : [];
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
              >
                <TiltCard intensity={8}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="group block glass-premium rounded-3xl p-8 transition-all duration-500 hover:shadow-glow-lg"
                  >
                    <div className="icon-3d mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500/20 to-accent/10 text-brand">
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="font-display text-2xl font-semibold transition-colors group-hover:text-brand-300">
                      {service.name}
                    </h3>
                    <p className="mt-3 leading-relaxed text-surface-gray">{service.description}</p>
                    <ul className="mt-6 grid grid-cols-2 gap-2">
                      {features.slice(0, 4).map((f: string) => (
                        <li key={f} className="flex items-center gap-2 text-sm text-surface-gray">
                          <span className="h-1 w-1 rounded-full bg-brand" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brand">
                      Learn more
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-2" />
                    </span>
                  </Link>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}